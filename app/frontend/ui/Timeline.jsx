import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import ShareIcon from 'material-ui-icons/Share';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReviewCardContainer from '../containers/ReviewCardContainer';
import EditReviewDialogContainer from '../containers/EditReviewDialogContainer';
import DeleteReviewDialogContainer from '../containers/DeleteReviewDialogContainer';
import MapIcon from 'material-ui-icons/Map';
import RateReviewIcon from 'material-ui-icons/RateReview';
import CreateMapDialogContainer from '../containers/CreateMapDialogContainer.js';
import Card, { CardHeader } from 'material-ui/Card';
import AddLocationIcon from 'material-ui-icons/AddLocation';
import PlaceSelectDialogContainer from '../containers/PlaceSelectDialogContainer';

const styles = {
  rootLarge: {
    margin: '94px auto 200px',
    width: '40%'
  },
  rootSmall: {
    margin: '56px auto 0',
    width: '100%'
  },
  container: {
    display: 'inline-block',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%'
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: 20
  },
  progress: {
    textAlign: 'center',
    padding: 10,
    marginTop: 20
  },
  noContentsContainer: {
    textAlign: 'center',
    color: '#9e9e9e',
    marginTop: 20
  },
  noContentsIcon: {
    width: 150,
    height: 150
  },
  profileImage: {
    width: 40
  },
  raisedButtonLarge: {
    width: '100%',
    marginBottom: 20
  },
  raisedButtonSmall: {
    width: '90%',
    marginBottom: 20
  },
  createButtonLarge: {
    zIndex: 1100,
    position: 'fixed',
    bottom: 32,
    right: 32,
    backgroundColor: 'red',
    color: 'white'
  },
  createButtonSmall: {
    zIndex: 1100,
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: 'red',
    color: 'white'
  },
  cardContainerSmall: {
    marginBottom: 0
  },
  cardContainerLarge: {
    marginBottom: 20
  },
};

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.handleClickLoadMoreButton = this.handleClickLoadMoreButton.bind(this);
  }

  componentWillMount() {
    this.props.updatePageTitle();
    this.props.refreshReviews();
  }

  handleClickLoadMoreButton() {
    this.props.loadMoreReviews(this.props.nextTimestamp);
  }

  renderProgress() {
    return (
      <div style={styles.progress}>
        <CircularProgress />
      </div>
    );
  }

  renderLoadMoreButton() {
    if (this.props.noMoreReviews) {
      return null;
    }
    return (
      <div style={styles.buttonContainer}>
        <Button raised onClick={this.handleClickLoadMoreButton} style={this.props.large ? styles.raisedButtonLarge : styles.raisedButtonSmall}>
          Load More
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div style={this.props.large ? styles.rootLarge : styles.rootSmall}>
        <div style={styles.container}>
          {this.props.loadingReviews ? this.renderProgress() : this.renderReviewContainer(this.props.currentReviews)}
        </div>
        {this.renderCreateReviewButton()}
        <PlaceSelectDialogContainer />
        <EditReviewDialogContainer />
        <DeleteReviewDialogContainer />
        <CreateMapDialogContainer />
      </div>
    );
  }

  renderCreateReviewButton() {
    return (
      <Button
        fab
        aria-label='add'
        style={this.props.large ? styles.createButtonLarge : styles.createButtonSmall}
        onClick={this.props.handleCreateReviewClick}
      >
        <AddLocationIcon />
      </Button>
    );
  }

  renderNoReviews() {
    return (
      <div style={styles.noContentsContainer}>
        <RateReviewIcon style={styles.noContentsIcon} />
        <Typography type='subheading' color='inherit'>
          When you create reports, you will see here.
        </Typography>
        <br/>
        <Button raised onClick={this.props.handleCreateMapButtonClick} style={this.props.large ? styles.raisedButtonLarge : styles.raisedButtonSmall}>
          Create New Map
        </Button>
        <Button raised onClick={this.props.handleDiscoverLinkClick} style={this.props.large ? styles.raisedButtonLarge : styles.raisedButtonSmall}>
          Discover Maps
        </Button>
      </div>
    );
  }

  renderReviewContainer(reviews) {
    if (reviews.length > 0) {
      return (
        <div>
          {this.renderReviewCards(reviews)}
          {this.props.loadingMoreReviews ? this.renderProgress() : this.renderLoadMoreButton()}
        </div>
      );
    } else {
      return this.renderNoReviews();
    }
  }

  renderReviewCards(reviews) {
    return reviews.map((review) => (
      <div key={review.id} style={this.props.large ? styles.cardContainerLarge : styles.cardContainerSmall}>
        <ReviewCardContainer currentReview={review} />
      </div>
    ));
  }
}
