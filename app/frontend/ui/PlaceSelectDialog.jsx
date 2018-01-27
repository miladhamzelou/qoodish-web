import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import PlaceIcon from 'material-ui-icons/Place';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const styles = {
  titleText: {
    marginLeft: 30
  },
  dialogContent: {
    paddingBottom: 0
  },
  placeIcon: {
    marginTop: -2,
    marginRight: 10,
    position: 'absolute'
  }
};

class PlaceSelectDialog extends Component {
  constructor(props) {
    super(props);
    this.handlePlaceSelected = this.handlePlaceSelected.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    let input = e.target.value;
    if (this.props.loadingPlaces || !input) {
      return;
    }
    this.props.handleInputChange(input);
  }

  handlePlaceSelected(place) {
    let params = {
      placeId: place.place_id,
      description: place.description
    };
    this.props.onClose();
    this.props.onPlaceSelected(params);
  }

  render() {
    return (
      <Dialog
        open={this.props.dialogOpen}
        onClose={this.props.onClose}
        fullWidth
      >
      　<DialogTitle>
          <PlaceIcon style={styles.placeIcon} /><div style={styles.titleText}>Select Place</div>
        </DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <TextField
            label='Search places...'
            onChange={this.handleInputChange}
            fullWidth
            autoFocus
          />
          <List>
            {this.renderPlaces()}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderPlaces() {
    return this.props.places.map((place) => (
      <ListItem
        button
        key={place.place_id}
        onClick={() => this.handlePlaceSelected(place)}
      >
        <ListItemAvatar>
          <Avatar>
            <PlaceIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={place.description}
        />
      </ListItem>
    ));
  }
}

export default PlaceSelectDialog;
