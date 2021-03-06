import React, { useCallback } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import I18n from '../../utils/I18n';

import requestMapCenter from '../../actions/requestMapCenter';
import selectSpot from '../../actions/selectSpot';

import Link from '../molecules/Link';

const styles = {
  activityText: {
    paddingRight: 32,
    fontSize: 14
  },
  secondaryAvatar: {
    borderRadius: 0,
    marginRight: 12,
    cursor: 'pointer'
  },
  subheader: {
    height: 36
  }
};

const fromNow = review => {
  return moment(review.created_at, 'YYYY-MM-DDThh:mm:ss.SSSZ')
    .locale(window.currentLocale)
    .format('LL');
};

const MapReviewsList = () => {
  const large = useMediaQuery('(min-width: 600px)');
  const mapReviews = useMappedState(
    useCallback(state => state.mapSummary.mapReviews, [])
  );

  return (
    <List
      subheader={
        large && (
          <ListSubheader style={styles.subheader}>
            {I18n.t('timeline')}
          </ListSubheader>
        )
      }
    >
      {mapReviews.map(review => (
        <ListItem
          button
          key={review.id}
          component={Link}
          to={{
            pathname: `/maps/${review.map.id}/reports/${review.id}`,
            state: { modal: true, review: review }
          }}
        >
          <Avatar
            src={review.author.profile_image_url}
            alt={review.author.name}
          />
          <ListItemText
            primary={
              <div style={styles.activityText}>
                <b>{review.author.name}</b> {I18n.t('created a report about')}
                <b>{review.spot.name}</b>
              </div>
            }
            secondary={fromNow(review)}
          />
          {review.image && (
            <ListItemSecondaryAction>
              <Avatar
                src={review.image.thumbnail_url}
                style={styles.secondaryAvatar}
                alt={review.spot.name}
                component={Link}
                to={{
                  pathname: `/maps/${review.map.id}/reports/${review.id}`,
                  state: { modal: true, review: review }
                }}
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default React.memo(MapReviewsList);
