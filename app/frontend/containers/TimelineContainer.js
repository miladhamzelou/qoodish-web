import { connect } from 'react-redux';
import Timeline from '../ui/Timeline';
import ApiClient from '../containers/ApiClient';
import openToast from '../actions/openToast';
import signOut from '../actions/signOut';
import { push } from 'react-router-redux';
import fetchMyProfile from '../actions/fetchMyProfile';
import fetchReviews from '../actions/fetchReviews';
import fetchMoreReviews from '../actions/fetchMoreReviews';
import loadReviewsStart from '../actions/loadReviewsStart';
import loadReviewsEnd from '../actions/loadReviewsEnd';
import loadMoreReviewsStart from '../actions/loadMoreReviewsStart';
import loadMoreReviewsEnd from '../actions/loadMoreReviewsEnd';
import updatePageTitle from '../actions/updatePageTitle';

import CreateMapDialogContainer from '../containers/CreateMapDialogContainer';
import fetchMaps from '../actions/fetchMaps';
import loadMapsStart from '../actions/loadMapsStart';
import loadMapsEnd from '../actions/loadMapsEnd';
import selectMap from  '../actions/selectMap';
import openCreateMapDialog from '../actions/openCreateMapDialog';

const mapStateToProps = (state) => {
  return {
    currentReviews: state.reviews.currentReviews,
    loadingReviews: state.reviews.loadingReviews,
    loadingMoreReviews: state.reviews.loadingMoreReviews,
    noMoreReviews: state.reviews.noMoreReviews,
    nextTimestamp: state.reviews.nextTimestamp,
    large: state.shared.large
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageTitle: () => {
      dispatch(updatePageTitle('Timeline'));
    },

    refreshReviews: async () => {
      dispatch(loadReviewsStart());
      const client = new ApiClient;
      let response = await client.fetchReviews();
      let reviews = await response.json();
      dispatch(loadReviewsEnd());
      if (response.ok) {
        dispatch(fetchReviews(reviews));
      } else if (response.status == 401) {
        dispatch(signOut());
        dispatch(openToast('Authenticate failed'));
      } else {
        dispatch(openToast('Failed to fetch reports.'));
      }
    },

    loadMoreReviews: async (timestamp) => {
      dispatch(loadMoreReviewsStart());
      const client = new ApiClient;
      let response = await client.fetchReviews(timestamp);
      let reviews = await response.json();
      dispatch(loadMoreReviewsEnd());
      if (response.ok) {
        dispatch(fetchMoreReviews(reviews));
      } else if (response.status == 401) {
        dispatch(signOut());
        dispatch(openToast('Authenticate failed'));
      } else {
        dispatch(openToast('Failed to fetch reports.'));
      }
    },

    handleDashboardLinkClick: () => {
      dispatch(push('/'));
    },

    handleCreateMapButtonClick: () => {
      dispatch(openCreateMapDialog());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline);