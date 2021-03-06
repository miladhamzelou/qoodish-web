import React, { useCallback, useEffect } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import DeleteAccountDialog from '../organisms/DeleteAccountDialog';
import CreateResourceButton from '../molecules/CreateResourceButton';
import ProviderLinkSettings from '../organisms/ProviderLinkSettings';

import I18n from '../../utils/I18n';
import getFirebase from '../../utils/getFirebase';
import getFirebaseMessaging from '../../utils/getFirebaseMessaging';
import ApiClient from '../../utils/ApiClient';

import openToast from '../../actions/openToast';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import openDeleteAccountDialog from '../../actions/openDeleteAccountDialog';
import fetchMyProfile from '../../actions/fetchMyProfile';
import fetchRegistrationToken from '../../actions/fetchRegistrationToken';

const styles = {
  rootLarge: {
    margin: '94px auto 20px',
    maxWidth: 700
  },
  rootSmall: {
    padding: 20,
    margin: '56px auto'
  },
  card: {
    marginBottom: 20
  },
  deleteButton: {
    color: 'white',
    backgroundColor: 'red'
  }
};

const DeleteAccountCard = () => {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentUser: state.app.currentUser
    }),
    []
  );
  const { currentUser } = useMappedState(mapState);

  const handleDeleteAccountButtonClick = useCallback(async () => {
    dispatch(openDeleteAccountDialog());
  });

  return (
    <Card style={styles.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {I18n.t('delete account')}
        </Typography>
        <Typography component="p">{I18n.t('this cannot be undone')}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          onClick={handleDeleteAccountButtonClick}
          style={
            currentUser && currentUser.isAnonymous ? {} : styles.deleteButton
          }
          disabled={currentUser && currentUser.isAnonymous}
        >
          {I18n.t('delete account')}
        </Button>
      </CardActions>
    </Card>
  );
};

const pushAvailable = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

const PushNotificationCard = () => {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentUser: state.app.currentUser
    }),
    []
  );
  const { currentUser } = useMappedState(mapState);

  const handleEnableNotification = useCallback(async () => {
    dispatch(requestStart());
    const firebase = await getFirebase();
    await getFirebaseMessaging();
    const messaging = firebase.messaging();
    const client = new ApiClient();

    try {
      await messaging.requestPermission();
    } catch (e) {
      console.log(e);
      dispatch(requestFinish());
      dispatch(openToast(I18n.t('unable to get permission')));
      return;
    }

    const registrationToken = await messaging.getToken();
    if (!registrationToken) {
      dispatch(requestFinish());
      dispatch(openToast(I18n.t('unable to get registration token')));
      return;
    }

    const response = await client.enablePushNotification(registrationToken);
    if (response.ok) {
      const user = await response.json();
      dispatch(fetchMyProfile(user));
      dispatch(fetchRegistrationToken(registrationToken));
      dispatch(requestFinish());
      dispatch(openToast(I18n.t('push successfully enabled')));
    } else {
      dispatch(requestFinish());
      dispatch(openToast(I18n.t('an error occured')));
    }
  });

  const handleDisableNotification = useCallback(async () => {
    dispatch(requestStart());
    const client = new ApiClient();
    const response = await client.disablePushNotification();
    if (response.ok) {
      const user = await response.json();
      dispatch(fetchMyProfile(user));
      dispatch(requestFinish());
      dispatch(openToast(I18n.t('push successfully disabled')));
    } else {
      dispatch(requestFinish());
      dispatch(openToast(I18n.t('an error occured')));
    }
  });

  const handlePushChange = useCallback((e, checked) => {
    if (checked) {
      handleEnableNotification();
    } else {
      handleDisableNotification();
    }
  });

  return (
    <Card style={styles.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {I18n.t('account settings')}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={currentUser && currentUser.push_enabled}
              onChange={handlePushChange}
              disabled={
                !pushAvailable() || (currentUser && currentUser.isAnonymous)
              }
            />
          }
          label={I18n.t('enable push notification')}
        />
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const large = useMediaQuery('(min-width: 600px)');

  useEffect(() => {
    gtag('config', process.env.GA_TRACKING_ID, {
      page_path: '/settings',
      page_title: 'Settings | Qoodish'
    });
  }, []);

  return (
    <div style={large ? styles.rootLarge : styles.rootSmall}>
      <PushNotificationCard />
      <div style={styles.card}>
        <ProviderLinkSettings />
      </div>
      <DeleteAccountCard />
      <DeleteAccountDialog />
      {large && <CreateResourceButton />}
    </div>
  );
};

export default React.memo(Settings);
