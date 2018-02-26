import { connect } from 'react-redux';
import ReviewDetail from '../ui/ReviewDetail';
import ApiClient from './ApiClient.js';
import openToast from '../actions/openToast';
import selectReview from '../actions/selectReview';
import loadReviewStart from '../actions/loadReviewStart';
import loadReviewEnd from '../actions/loadReviewEnd';
import clearReviewState from '../actions/clearReviewState';
import updatePageTitle from '../actions/updatePageTitle';

const mapStateToProps = state => {
  return {
    currentReview: state.reviewDetail.currentReview,
    reviewLoading: state.reviewDetail.reviewLoading,
    large: state.shared.large
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePageTitle: () => {
      dispatch(updatePageTitle('Report'));
    },

    fetchReview: async () => {
      dispatch(loadReviewStart());
      const client = new ApiClient();
      let response = await client.fetchReview(
        ownProps.match.params.mapId,
        ownProps.match.params.reviewId
      );
      let json = await response.json();
      dispatch(loadReviewEnd());
      if (response.ok) {
        dispatch(selectReview(json));
      } else if (response.status == 401) {
        dispatch(signOut());
        dispatch(openToast('Authenticate failed'));
      } else if (response.status == 404) {
        dispatch(openToast('Report not found.'));
      } else {
        dispatch(openToast('Failed to fetch Report.'));
      }
    },

    clear: () => {
      dispatch(clearReviewState());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetail);