const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

const functions = require('firebase-functions');
const express = require('express');

import ssr from './ssr';

const BOTS = [
  '\\+https:\\/\\/developers.google.com\\/\\+\\/web\\/snippet\\/',
  'googlebot',
  'google-structured-data-testing-tool',
  'mediapartners-google',
  'baiduspider',
  'gurujibot',
  'yandexbot',
  'slurp',
  'msnbot',
  'bingbot',
  'facebookexternalhit',
  'linkedinbot',
  'twitterbot',
  'slackbot',
  'telegrambot',
  'applebot',
  'pingdom',
  'tumblr '
];

const IS_BOT_REGEXP = new RegExp('^.*(' + BOTS.join('|') + ').*$');

const isBot = (req) => {
  let source = req.headers['user-agent'] || '';
  if (typeof source === 'undefined') {
    source = 'unknown';
  }
  let isBot = IS_BOT_REGEXP.exec(source.toLowerCase());
  if (isBot) {
    isBot = isBot[1];
  }
  return isBot;
};

const { IncomingWebhook } = require('@slack/client');
const feedbackWebhook = new IncomingWebhook(functions.config().app.feedback_webhook_url);
const cloudBuildWebhook = new IncomingWebhook(functions.config().app.cloud_build_webhook_url);

const app = express();

const pageRoutes = [
  '/',
  '/discover',
  '/login',
  '/maps',
  '/maps/:mapId',
  '/maps/:mapId/reports/:reviewId',
  '/profile',
  '/users/:userId',
  '/spots/:placeId',
  '/notifications',
  '/settings',
  '/invites',
  '/terms',
  '/privacy'
];

app.get(pageRoutes, async (req, res) => {
  if (isBot(req)) {
    console.log(`Bot access: ${req.headers['user-agent']}`);
    console.log(`Request URL: ${req.originalUrl}`);

    const { html, ttRenderMs } = await ssr(`https://qoodish.com${req.originalUrl}`, req.headers['user-agent']);
    // Add Server-Timing! See https://w3c.github.io/server-timing/.
    res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
    res.status(200).send(html); // Serve prerendered page as response.
  } else {
    //res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.status(200).send(fs.readFileSync('./hosting/index.html').toString());
  }
});

exports.host = functions.https.onRequest(app);

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(new Buffer(data, 'base64').toString());
}

// createSlackMessage creates a message from a build object.
const createSlackMessage = (build) => {
  let message = {
    text: `Build ${build.id} :cocoa5:`,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build logs',
        title_link: build.logUrl,
        fields: [{
          title: 'Status',
          value: build.status
        }]
      }
    ]
  };
  return message;
}

exports.subscribeCloudBuild = functions.pubsub
  .topic('cloud-builds')
  .onPublish((message) => {
    const build = eventToBuild(message.data);

    // Skip if the current status is not in the status list.
    // Add additional statuses to list if you'd like:
    // QUEUED, WORKING, SUCCESS, FAILURE,
    // INTERNAL_ERROR, TIMEOUT, CANCELLED
    const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
    if (status.indexOf(build.status) === -1) {
      console.log('Build status is not the target status.');
      return null;
    }

    cloudBuildWebhook.send(createSlackMessage(build), (err, res) => {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Message sent: ', res);
      }
    });
  });

exports.notifyFeedback = functions.firestore
  .document('feedbacks/{feedbackId}')
  .onCreate((snap, context) => {
    feedbackWebhook.send('ユーザーからのフィードバックがあったよ！', (err, res) => {
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('Message sent: ', res);
      }
    });
  });

exports.generateThumbnail = functions.region('asia-northeast1').storage.bucket(functions.config().app.firebase_image_bucket_name).object().onFinalize((object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;

  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  const fileName = path.basename(filePath);
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return null;
  }

  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
    cacheControl: 'public,max-age=86400'
  };

  return bucket.file(filePath).download({
    destination: tempFilePath,
  }).then(() => {
    console.log('Image downloaded locally to', tempFilePath);
    return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
  }).then(() => {
    console.log('Thumbnail created at', tempFilePath);
    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    return bucket.upload(tempFilePath, {
      destination: thumbFilePath,
      metadata: metadata
    });
  }).then(() => fs.unlinkSync(tempFilePath));
});
