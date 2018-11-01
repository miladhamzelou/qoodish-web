import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DeleteReviewDialog from '../ui/DeleteReviewDialog';
import ApiClient from './ApiClient';
import deleteReview from '../actions/deleteReview';
import closeDeleteReviewDialog from '../actions/closeDeleteReviewDialog';
import closeReviewDialog from '../actions/closeReviewDialog';
import openToast from '../actions/openToast';
import requestStart from '../actions/requestStart';
import requestFinish from '../actions/requestFinish';
import fetchSpots from '../actions/fetchSpots';
import { deleteFromStorage } from './Utils';

const mapStateToProps = state => {
  return {
    currentReview: state.reviews.targetReview,
    dialogOpen: state.reviews.deleteReviewDialogOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleRequestDialogClose: () => {
      dispatch(closeDeleteReviewDialog());
    },

    handleDeleteButtonClick: async review => {
      dispatch(requestStart());
      const client = new ApiClient();
      const response = await client.deleteReview(review.id);
      dispatch(requestFinish());
      if (response.ok) {
        if (review.image) {
          deleteFromStorage(review.image.file_name);
        }
        dispatch(closeReviewDialog());
        dispatch(closeDeleteReviewDialog());
        if (ownProps.mapId) {
          let spotResponse = await client.fetchSpots(review.map.id);
          if (spotResponse.ok) {
            let spots = await spotResponse.json();
            dispatch(fetchSpots(spots));
          }
          ownProps.history.push(`/maps/${review.map.id}`);
        }
        dispatch(deleteReview(review.id));
        dispatch(openToast('Delete report successfully'));
      } else {
        let json = await response.json();
        dispatch(openToast(json.detail));
      }
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeleteReviewDialog));
