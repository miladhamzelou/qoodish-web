import React, { useCallback, useState } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Link from '../molecules/Link';

import ApiClient from '../../utils/ApiClient';
import searchMaps from '../../actions/searchMaps';
import closeSearchMapsDialog from '../../actions/closeSearchMapsDialog';
import I18n from '../../utils/I18n';

const styles = {
  toolbar: {
    paddingLeft: 8,
    height: 56
  },
  paper: {
    marginTop: 56
  },
  dialogPaper: {
    background: '#f1f1f1'
  },
  input: {
    padding: 0
  }
};

const SearchMapsDialog = () => {
  const dispatch = useDispatch();
  const mapState = useCallback(
    state => ({
      pickedMaps: state.shared.pickedMaps,
      dialogOpen: state.shared.searchMapsDialogOpen
    }),
    []
  );
  const { pickedMaps, dialogOpen } = useMappedState(mapState);

  const [loading, setLoading] = useState(false);

  const handleRequestClose = useCallback(() => {
    dispatch(closeSearchMapsDialog());
  });

  const handleInputChange = useCallback(async input => {
    if (loading || !input) {
      return;
    }
    setLoading(true);
    const client = new ApiClient();
    let response = await client.searchMaps(input);
    let maps = await response.json();
    setLoading(false);
    if (response.ok) {
      dispatch(searchMaps(maps));
    }
  });

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleRequestClose}
      fullScreen
      PaperProps={{
        style: styles.dialogPaper
      }}
    >
      <AppBar color="inherit">
        <Toolbar style={styles.toolbar}>
          <IconButton color="inherit" onClick={handleRequestClose}>
            <ArrowBackIcon />
          </IconButton>
          <TextField
            onChange={e => handleInputChange(e.target.value)}
            fullWidth
            autoFocus
            type="search"
            placeholder={I18n.t('search map')}
            InputProps={{
              disableUnderline: true
            }}
            inputProps={{
              style: styles.input
            }}
          />
        </Toolbar>
      </AppBar>
      <Paper style={styles.paper}>
        <List disablePadding={pickedMaps.length < 1}>
          {pickedMaps.map(map => (
            <ListItem
              button
              component={Link}
              to={`/maps/${map.id}`}
              key={map.id}
              onClick={handleRequestClose}
            >
              <ListItemAvatar>
                <Avatar alt={map.name} src={map.thumbnail_url} />
              </ListItemAvatar>
              <ListItemText
                primary={map.name}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Dialog>
  );
};

export default React.memo(SearchMapsDialog);
