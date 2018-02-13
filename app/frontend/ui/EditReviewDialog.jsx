import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import PlaceIcon from 'material-ui-icons/Place';
import PhotoCameraIcon from 'material-ui-icons/PhotoCamera';
import CancelIcon from 'material-ui-icons/Cancel';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { ListItemText } from 'material-ui/List';

const styles = {
  imagePreviewContainer: {
    position: 'relative'
  },
  imagePreview: {
    width: '100%'
  },
  clearImageIcon: {
    position: 'absolute',
    right: 0,
  },
  imageInput: {
    display: 'none'
  }
};

class EditReviewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      mapId: undefined,
      comment: '',
      placeId: '',
      placeName: '',
      image: null,
      imagePreviewUrl: '',
      errorComment: '',
      disabled: true,
      imageDeleteRequest: false
    };
    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleClearImageClick = this.handleClearImageClick.bind(this);
    this.clearInputs = this.clearInputs.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dialogOpen) {
      return;
    }
    let currentReview = nextProps.currentReview;
    if (currentReview) {
      let imagePreviewUrl = '';
      if (currentReview.image) {
        imagePreviewUrl = currentReview.image.url;
      }
      this.setState({
        id: currentReview.id,
        mapId: currentReview.map_id,
        comment: currentReview.comment,
        placeId: currentReview.place_id,
        placeName: currentReview.spot.name,
        imagePreviewUrl: imagePreviewUrl,
        disabled: false
      }, () => {
        this.drawImagePreview(imagePreviewUrl);
      });
    } else {
      this.clearInputs();
      this.setState({
        placeId: nextProps.selectedPlace.placeId,
        placeName: nextProps.selectedPlace.description
      });
      if (!this.state.mapId && nextProps.postableMaps.length > 0) {
        this.setState({
          mapId: nextProps.postableMaps[0].id
        });
      }
    }
    if (nextProps.mapId) {
      this.setState({
        mapId: nextProps.mapId
      });
    }
  }

  handleMapChange(e) {
    let mapId = e.target.value;
    this.setState({
      mapId: mapId
    }, () => {
      this.validate();
    });
  }

  handleCommentChange(e) {
    let comment = e.target.value;
    let errorText;
    if (comment) {
      if (comment.length > 140) {
        errorText = 'The maximum number of characters is 140';
      } else {
        errorText = '';
      }
    } else {
      errorText = 'Comment is required';
    }

    this.setState({
      comment: comment,
      errorComment: errorText
    }, () => {
      this.validate();
    });
  }

  validate() {
    let disabled;
    if (this.state.comment && !this.state.errorComment && this.state.mapId) {
      disabled = false;
    } else {
      disabled = true;
    }
    this.setState({
      disabled: disabled
    });
  }

  handleSaveButtonClick() {
    let params = {
      comment: this.state.comment,
      place_id: this.state.placeId
    };
    let canvas = document.getElementById('canvas');
    if (this.imageNotChanged()) {
      canvas = null;
    }
    if (this.props.currentReview) {
      params.review_id = this.state.id;
      this.props.handleClickEditButton(this.props.currentReview, params, canvas, this.state.imageDeleteRequest);
    } else {
      this.props.handleClickCreateButton(this.state.mapId, params, canvas);
    }
  }

  imageNotChanged() {
    return this.props.currentReview && this.props.currentReview.image && this.state.imagePreviewUrl == this.props.currentReview.image.url;
  }

  handleAddImageClick(e) {
    document.getElementById('review-image-input').click();
  }

  handleImageChange(e) {
    // 一回リセットしないと canvas の CORS エラーになる
    this.handleClearImageClick();

    let reader = new FileReader();
    let file = e.target.files[0];
    if (!file.type.match(/image\/*/)) {
      return;
    }

    reader.onloadend = () => {
      let dataUrl = reader.result;
      this.setState({
        image: file,
        imagePreviewUrl: dataUrl,
        imageDeleteRequest: false
      });

      this.drawImagePreview(dataUrl);
    }

    reader.readAsDataURL(file);
  }

  drawImagePreview(imageUrl) {
    let canvas = document.getElementById('canvas');
    if (!canvas) {
      return;
    }
    if (canvas.getContext) {
      let context = canvas.getContext('2d');
      let image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      };
    }
  }

  handleClearImageClick() {
    this.setState({
      image: null,
      imagePreviewUrl: '',
      imageDeleteRequest: true
    });
  }

  handleRequestClose() {
    this.props.handleRequestClose();
    this.clearInputs();
  }

  clearInputs() {
    this.setState({
      id: null,
      mapId: null,
      comment: '',
      placeId: '',
      placeName: '',
      image: null,
      imagePreviewUrl: '',
      errorComment: '',
      disabled: true
    });
  }

  render() {
    return (
      <Dialog
        open={this.props.dialogOpen}
        onClose={this.handleRequestClose}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
      >
      　<DialogTitle>
          {this.props.currentReview ? 'Edit Report' : 'Create New Report'}
        </DialogTitle>
        <DialogContent>
          <Chip
            avatar={<Avatar><PlaceIcon /></Avatar>}
            label={this.state.placeName}
          />
          <br/>
          <br/>
          {this.renderMapSelect()}
          <br/>
          <br/>
          {this.renderCommentBox()}
          <br/>
          <br/>
          {this.state.imagePreviewUrl ? this.renderImagePreview() : null}
          <IconButton onClick={this.handleAddImageClick}>
            <PhotoCameraIcon />
          </IconButton>
          <input
            type='file'
            accept='image/*'
            id='review-image-input'
            onChange={this.handleImageChange}
            style={styles.imageInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose}>
            Cancel
          </Button>
          <Button raised onClick={this.handleSaveButtonClick} color='primary' disabled={this.state.disabled}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderMapSelect() {
    return (
      <FormControl
        fullWidth
        error={this.state.mapId ? false : true}
      >
        <InputLabel htmlFor='map-input'>Map</InputLabel>
        <Select
          value={this.state.mapId ? this.state.mapId : ''}
          onChange={this.handleMapChange}
          input={<Input id='map-input' style={{padding: 20}}/>}
          renderValue={(value) => this.renderSelectValue(value, this.props.postableMaps)}
          style={{height: 'auto'}}
        >
          {this.renderPostableMaps()}
        </Select>
        <FormHelperText>{!this.state.mapId && 'Map is required'}</FormHelperText>
      </FormControl>
    );
  }

  renderSelectValue(mapId, maps) {
    let map = maps.find((map) => { return map.id == mapId });
    return map ? map.name : '';
  }

  renderPostableMaps() {
    return this.props.postableMaps.map((map) => (
      <MenuItem key={map.id} value={map.id}>
        <Avatar src={map.image_url} />
        <ListItemText primary={map.name} />
      </MenuItem>
    ));
  }

  renderCommentBox() {
    return (
      <TextField
        label='Comment'
        onChange={this.handleCommentChange}
        error={this.state.errorComment ? true : false}
        helperText={this.state.errorComment}
        fullWidth
        value={this.state.comment}
        multiline
        autoFocus
        rowsMax='5'
        rows='5'
      />
    );
  }

  renderImagePreview() {
    return (
      <div style={styles.imagePreviewContainer}>
        <IconButton
          style={styles.clearImageIcon}
          onClick={this.handleClearImageClick}
        >
          <CancelIcon />
        </IconButton>
        <canvas id='canvas' style={styles.imagePreview}></canvas>
      </div>
    );
  }
}

export default EditReviewDialog;
