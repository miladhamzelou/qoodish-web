import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import MapDetail from '../ui/MapDetail';
import ApiClient from './ApiClient';
import selectMap from '../actions/selectMap';
import openPlaceSelectDialog from '../actions/openPlaceSelectDialog';
import openToast from '../actions/openToast';
import updatePageTitle from '../actions/updatePageTitle';
import requestCurrentPosition from '../actions/requestCurrentPosition';
import getMapBasePosition from '../actions/getMapBasePosition';
import requestMapBase from '../actions/requestMapBase';
import fetchSpots from '../actions/fetchSpots';
import clearMapState from '../actions/clearMapState';

const mapStateToProps = state => {
  return {
    large: state.shared.large,
    currentMap: state.mapDetail.currentMap,
    currentSpot: state.spotCard.currentSpot,
    spotCardOpen: state.spotCard.spotCardOpen,
    mapSummaryOpen: state.mapDetail.mapSummaryOpen
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePageTitle: (mapName = undefined) => {
      dispatch(updatePageTitle(mapName ? mapName : 'Map'));
    },

    initCenter: async map => {
      if (map.base.place_id) {
        dispatch(getMapBasePosition(map.base.lat, map.base.lng));
        dispatch(requestMapBase());
      } else {
        dispatch(requestCurrentPosition());
      }
    },

    fetchMap: async () => {
      const client = new ApiClient();
      let response = await client.fetchMap(ownProps.match.params.mapId);
      if (response.ok) {
        let map = await response.json();
        dispatch(selectMap(map));
      } else if (response.status == 401) {
        dispatch(openToast('Authenticate failed'));
      } else if (response.status == 404) {
        dispatch(push('/maps'));
      } else {
        dispatch(openToast('Failed to fetch Map.'));
      }
    },

    fetchSpots: async () => {
      const client = new ApiClient();
      let response = await client.fetchSpots(ownProps.match.params.mapId);
      if (response.ok) {
        let spots = await response.json();
        dispatch(fetchSpots(spots));
      }
    },

    handleCreateReviewClick: () => {
      dispatch(openPlaceSelectDialog());
    },

    handleUnmount: () => {
      dispatch(clearMapState());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapDetail);
