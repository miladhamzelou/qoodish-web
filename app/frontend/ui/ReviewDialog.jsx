import React, { Component } from 'react';
import Dialog, {
  DialogContent,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import CloseIcon from 'material-ui-icons/Close';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ReviewCardContainer from '../containers/ReviewCardContainer';

const styles = {
  appbar: {
    position: 'relative'
  },
  toolbar: {
    paddingLeft: 8
  },
  flex: {
    flex: 1
  },
  dialogContent: {
    padding: 0
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ReviewDialog extends Component {
  render() {
    return (
      <Dialog
        open={this.props.dialogOpen}
        onClose={this.props.handleRequestDialogClose}
        TransitionComponent={Transition}
        fullWidth
        fullScreen={this.props.large ? false : true}
      >
        {!this.props.large && this.renderAppBar()}
        <DialogContent style={styles.dialogContent}>
          <div>
            {this.props.currentReview &&
              this.renderReviewCard(this.props.currentReview)}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  renderAppBar() {
    return (
      <AppBar style={styles.appbar} color="primary">
        <Toolbar style={styles.toolbar}>
          <IconButton
            color="inherit"
            onClick={this.props.handleRequestDialogClose}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="title" color="inherit" style={styles.flex}>
            Report
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  renderReviewCard(review) {
    return (
      <ReviewCardContainer
        currentReview={review}
        detail={!this.props.large}
      />
    );
  }
}

export default ReviewDialog;
