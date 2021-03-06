import React, { useState, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import I18n from '../../utils/I18n';

import openEditMapDialog from '../../actions/openEditMapDialog';
import openDeleteMapDialog from '../../actions/openDeleteMapDialog';
import openInviteTargetDialog from '../../actions/openInviteTargetDialog';
import openIssueDialog from '../../actions/openIssueDialog';
import openSignInRequiredDialog from '../../actions/openSignInRequiredDialog';

const styles = {
  mapMenuIcon: {
    color: 'white'
  }
};

const isInvitable = map => {
  return map && map.private && (map.editable || map.invitable);
};

const MapVertMenu = () => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

  const mapState = useCallback(
    state => ({
      map: state.mapSummary.currentMap,
      currentUser: state.app.currentUser
    }),
    []
  );
  const { map, currentUser } = useMappedState(mapState);

  const dispatch = useDispatch();

  const handleEditMapButtonClick = useCallback(() => {
    setMenuOpen(false);
    dispatch(openEditMapDialog(map));
  });

  const handleDeleteMapButtonClick = useCallback(() => {
    setMenuOpen(false);
    dispatch(openDeleteMapDialog(map));
  });

  const handleInviteButtonClick = useCallback(() => {
    setMenuOpen(false);
    dispatch(openInviteTargetDialog());
  });

  const handleIssueButtonClick = useCallback(() => {
    setMenuOpen(false);
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
    } else {
      dispatch(openIssueDialog(map.id, 'map'));
    }
  });

  return (
    <div>
      <IconButton
        aria-label="More vert"
        aria-owns={menuOpen ? 'vert-menu' : null}
        aria-haspopup="true"
        onClick={e => {
          setAnchorEl(e.currentTarget);
          setMenuOpen(true);
        }}
      >
        <MoreVertIcon style={styles.mapMenuIcon} />
      </IconButton>

      <Menu
        id="vert-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        {map && map.editable ? (
          [
            <MenuItem key="edit" onClick={handleEditMapButtonClick}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary={I18n.t('edit')} />
            </MenuItem>,
            <MenuItem key="delete" onClick={handleDeleteMapButtonClick}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary={I18n.t('delete')} />
            </MenuItem>,
            isInvitable(map) && (
              <MenuItem key="invite" onClick={handleInviteButtonClick}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary={I18n.t('invite')} />
              </MenuItem>
            )
          ]
        ) : (
          <MenuItem key="issue" onClick={handleIssueButtonClick}>
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary={I18n.t('report')} />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default React.memo(MapVertMenu);
