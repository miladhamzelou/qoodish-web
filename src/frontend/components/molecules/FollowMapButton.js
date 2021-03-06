import React, { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Button from '@material-ui/core/Button';
import I18n from '../../utils/I18n';

import openLeaveMapDialog from '../../actions/openLeaveMapDialog';
import openSignInRequiredDialog from '../../actions/openSignInRequiredDialog';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import fetchCollaborators from '../../actions/fetchCollaborators';
import ApiClient from '../../utils/ApiClient';
import joinMap from '../../actions/joinMap';
import openToast from '../../actions/openToast';

const RoleButton = props => {
  const currentUser = useMappedState(
    useCallback(state => state.app.currentUser, [])
  );
  const map = props.currentMap;
  const dispatch = useDispatch();

  const handleUnfollowButtonClick = useCallback(() => {
    dispatch(openLeaveMapDialog(map));
  });

  const handleFollowButtonClick = useCallback(async () => {
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
      return;
    }
    dispatch(requestStart());
    const client = new ApiClient();
    let followResponse = await client.followMap(map.id);
    dispatch(requestFinish());
    if (followResponse.ok) {
      let json = await followResponse.json();
      dispatch(joinMap(json));
      dispatch(openToast(I18n.t('follow map success')));

      gtag('event', 'follow', {
        event_category: 'engagement',
        event_label: 'map'
      });

      let colloboratorsResponse = await client.fetchCollaborators(map.id);
      let collaborators = await colloboratorsResponse.json();
      dispatch(fetchCollaborators(collaborators));
    } else {
      dispatch(openToast('Failed to follow map'));
    }
  });

  if (map.editable) {
    return (
      <Button variant="contained" disabled>
        {I18n.t('owner')}
      </Button>
    );
  } else if (map.following) {
    return (
      <Button variant="contained" onClick={handleUnfollowButtonClick}>
        {I18n.t('following')}
      </Button>
    );
  } else {
    return (
      <Button
        variant="contained"
        onClick={handleFollowButtonClick}
        color="primary"
      >
        {I18n.t('follow')}
      </Button>
    );
  }
};

const FollowMapButton = props => {
  return (
    <div>
      {props.currentMap ? (
        <RoleButton {...props} />
      ) : (
        <Button variant="contained" color="secondary" disabled>
          {''}
        </Button>
      )}
    </div>
  );
};

export default React.memo(FollowMapButton);
