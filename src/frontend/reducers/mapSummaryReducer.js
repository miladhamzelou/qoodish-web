import {
  SELECT_MAP,
  EDIT_MAP,
  FETCH_COLLABORATORS,
  FETCH_MAP_REVIEWS,
  CREATE_REVIEW,
  EDIT_REVIEW,
  DELETE_REVIEW,
  CLEAR_MAP_STATE,
  JOIN_MAP,
  LEAVE_MAP,
  SELECT_SPOT
} from '../actionTypes';

const initialState = {
  currentMap: null,
  followers: [],
  mapReviews: [],
  spotReviews: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_MAP:
      return Object.assign({}, state, {
        currentMap: action.payload.map
      });
    case EDIT_MAP:
      return Object.assign({}, state, {
        currentMap: action.payload.map
      });
    case FETCH_COLLABORATORS:
      return Object.assign({}, state, {
        followers: action.payload.collaborators
      });
    case FETCH_MAP_REVIEWS:
      return Object.assign({}, state, {
        mapReviews: [...action.payload.reviews]
      });
    case JOIN_MAP:
      return Object.assign({}, state, {
        currentMap: action.payload.currentMap
      });
    case LEAVE_MAP:
      return Object.assign({}, state, {
        currentMap: action.payload.currentMap
      });
    case CREATE_REVIEW:
      if (
        state.currentMap &&
        state.currentMap.id != action.payload.review.map.id
      ) {
        return state;
      }
      return Object.assign({}, state, {
        mapReviews: [action.payload.review, ...state.mapReviews]
      });
    case EDIT_REVIEW:
      if (state.mapReviews.length === 0) {
        return state;
      }

      let index = state.mapReviews.findIndex(review => {
        return review.id == action.payload.review.id;
      });
      let currentReview = state.mapReviews[index];
      if (!currentReview) {
        return state;
      }

      Object.assign(currentReview, action.payload.review);

      return Object.assign({}, state, {
        mapReviews: [
          ...state.mapReviews.slice(0, index),
          currentReview,
          ...state.mapReviews.slice(index + 1)
        ]
      });
    case DELETE_REVIEW:
      if (state.mapReviews.length === 0) {
        return state;
      }

      let mapReviews = state.mapReviews.filter(review => {
        return review.id != action.payload.id;
      });
      return Object.assign({}, state, {
        mapReviews: mapReviews
      });
    case SELECT_SPOT:
      let reviews = state.mapReviews.filter(review => {
        return review.place_id === action.payload.spot.place_id;
      });
      return Object.assign({}, state, {
        spotReviews: reviews
      });
    case CLEAR_MAP_STATE:
      return Object.assign({}, state, {
        currentMap: null,
        followers: [],
        mapReviews: []
      });
    default:
      return state;
  }
};

export default reducer;
