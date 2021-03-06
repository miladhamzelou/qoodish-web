import React, { useCallback, useEffect, useState } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import CircularProgress from '@material-ui/core/CircularProgress';

import LoadMoreUserReviewsButton from '../molecules/LoadMoreUserReviewsButton';
import ReviewGridList from './ReviewGridList';
import NoContents from '../molecules/NoContents';

import fetchUserReviews from '../../actions/fetchUserReviews';
import I18n from '../../utils/I18n';
import ApiClient from '../../utils/ApiClient';

const styles = {
  reviewsLarge: {
    marginTop: 20,
    paddingBottom: 20
  },
  reviewsSmall: {
    marginTop: 8,
    paddingBottom: 16
  },
  noReviewsLarge: {
    paddingTop: 20
  },
  noReviewsSmall: {
    paddingTop: 8
  },
  progress: {
    textAlign: 'center',
    padding: 20,
    marginTop: 20
  }
};

const ProfileReviews = props => {
  const large = useMediaQuery('(min-width: 600px)');
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentReviews: state.profile.currentReviews,
      pathname: state.shared.currentLocation
    }),
    []
  );

  const { currentReviews, pathname } = useMappedState(mapState);

  const currentUser = props.currentUser;

  const [loading, setLoading] = useState(true);

  const initReviews = useCallback(async () => {
    if (!currentUser || (pathname === '/profile' && currentUser.isAnonymous)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const client = new ApiClient();
    let userId = pathname === '/profile' ? undefined : props.params.primaryId;
    let response = await client.fetchUserReviews(userId);
    let reviews = await response.json();
    dispatch(fetchUserReviews(reviews));
    setLoading(false);
  });

  useEffect(() => {
    initReviews();
  }, []);

  if (loading) {
    return (
      <div style={styles.progress}>
        <CircularProgress />
      </div>
    );
  } else {
    return currentReviews.length > 0 ? (
      <div style={large ? styles.reviewsLarge : styles.reviewsSmall}>
        <ReviewGridList reviews={currentReviews} />
        <LoadMoreUserReviewsButton {...props} />
      </div>
    ) : (
      <div style={large ? styles.noReviewsLarge : styles.noReviewsSmall}>
        <NoContents
          contentType="review"
          action="create-review"
          message={I18n.t('reports will see here')}
        />
      </div>
    );
  }
};

export default React.memo(ProfileReviews);
