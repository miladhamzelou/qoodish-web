import {
  SELECT_REVIEW,
  EDIT_REVIEW,
  DELETE_REVIEW,
  CLEAR_REVIEW_STATE
} from '../actionTypes';

const initialState = {
  currentReview: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_REVIEW:
      return Object.assign({}, state, {
        currentReview: action.payload.review
      });
    case EDIT_REVIEW:
      if (!state.currentReview) {
        return state;
      }
      return Object.assign({}, state, {
        currentReview: action.payload.review
      });
    case DELETE_REVIEW:
      if (!state.currentReview) {
        return state;
      }
      return Object.assign({}, state, {
        currentReview: undefined
      });
    case CLEAR_REVIEW_STATE:
      return Object.assign({}, state, {
        currentReview: undefined
      });
    default:
      return state;
  }
};

export default reducer;
