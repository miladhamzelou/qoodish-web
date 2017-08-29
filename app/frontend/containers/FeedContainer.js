import { connect } from 'react-redux';
import Feed from '../ui/Feed';
import ApiClient from '../containers/ApiClient';
import openToast from '../actions/openToast';
import updatePageTitle from '../actions/updatePageTitle';
import signOut from '../actions/signOut';
import { push } from 'react-router-redux';
import fetchReviews from '../actions/fetchReviews';
import fetchMoreReviews from '../actions/fetchMoreReviews';
import loadReviewsStart from '../actions/loadReviewsStart';
import loadReviewsEnd from '../actions/loadReviewsEnd';
import loadMoreReviewsStart from '../actions/loadMoreReviewsStart';
import loadMoreReviewsEnd from '../actions/loadMoreReviewsEnd';

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
      dispatch(updatePageTitle('Feed'));
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);
