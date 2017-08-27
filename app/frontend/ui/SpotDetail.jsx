import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Card, { CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import GroupIcon from 'material-ui-icons/Group';
import AddLocationIcon from 'material-ui-icons/AddLocation';
import DirectionsIcon from 'material-ui-icons/Directions';
import Divider from 'material-ui/Divider';
import Toolbar from 'material-ui/Toolbar';
import { GridListTileBar } from 'material-ui/GridList';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
import PlaceIcon from 'material-ui-icons/Place';

const styles = {
  drawer: {
    position: 'fixed',
    zIndex: 1
  },
  cardContainerLarge: {
    marginTop: 64,
    width: 330,
    height: 'calc(100% - 64px)'
  },
  cardContainerSmall: {
    marginTop: 56,
    width: 330,
    height: 'calc(100% - 56px)'
  },
  card: {
    height: '100%',
    overflowY: 'scroll'
  },
  media: {
    height: 330
  },
  spotAddress: {
    whiteSpace: 'initial'
  },
  toolbar: {
    cursor: 'pointer'
  },
  spotToolbar: {
    backgroundImage: 'linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))',
    position: 'absolute',
    zIndex: 1,
    right: 0,
    left: 0
  },
  spotToobarIcon: {
    color: 'white'
  },
  toolbarActions: {
    marginLeft: 'auto'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  expandTitle: {
    paddingLeft: 16,
    display: 'inline-flex'
  },
  expandContentIcon: {
    marginRight: 10
  },
  listItemContent: {
    overflow: 'hidden'
  },
  listItemText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  reviewImage: {
    width: 40,
    height: 40
  },
  tileBar: {
    marginBottom: 7,
    paddingTop: 16,
    paddingBottom: 16,
    height: 'initial'
  }
};

class SpotDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaboratorExpanded: true,
      reviewExpanded: true,
    };
    this.handleExpandReviewClick = this.handleExpandReviewClick.bind(this);
  }

  handleExpandReviewClick() {
    this.setState({
      reviewExpanded: !this.state.reviewExpanded
    });
  }

  render() {
    return (
      <Drawer
        anchor='right'
        open={this.props.drawerOpen}
        docked
        style={styles.drawer}
      >
        {this.props.currentSpot ? this.renderSpotSummary(this.props.currentSpot) : null}
      </Drawer>
    );
  }

  renderSpotSummary(spot) {
    return (
      <div style={this.props.large ? styles.cardContainerLarge : styles.cardContainerSmall}>
        <Toolbar style={styles.spotToolbar} disableGutters>
          <div>
            <IconButton
              color='contrast'
              onClick={this.props.handleCloseSpotButtonClick}
            >
              <ChevronRightIcon style={styles.spotToobarIcon} />
            </IconButton>
          </div>
        </Toolbar>
        <Card style={styles.card}>
          <CardMedia>
            <img src={this.props.currentSpot.image_url} style={styles.media} />
            <GridListTileBar
              title={
                <Typography type='headline' component='h2' color='inherit' gutterBottom>
                  <PlaceIcon /> {spot.name}
                </Typography>
              }
              subtitle={
                <Typography component='p' color='inherit' style={styles.spotAddress}>
                  {spot.formatted_address}
                </Typography>
              }
              style={styles.tileBar}
            />
          </CardMedia>
          <BottomNavigation showLabels>
            <BottomNavigationButton
              label='Post'
              icon={<AddLocationIcon />}
              onClick={() => this.props.handleAddReviewButtonClick(spot)}
              disabled={!this.ableToPost(this.props.currentMap)}
            />
            <BottomNavigationButton
              label='Directions'
              icon={<DirectionsIcon />}
              onClick={() => this.props.handleRouteButtonClick(spot, this.props.currentPosition)}
            />
          </BottomNavigation>
          <Divider />
          <Toolbar style={styles.toolbar} disableGutters onClick={this.handleExpandReviewClick}>
            <Typography style={styles.expandTitle} type='title' color='secondary'>
              <GroupIcon style={styles.expandContentIcon}/> Contributors
            </Typography>
            <div style={styles.toolbarActions}>
              <IconButton
                aria-expanded={this.state.reviewExpanded}
                aria-label='Show more'
               >
                 <ExpandMoreIcon style={this.state.reviewExpanded ? styles.expandOpen : {}} />
              </IconButton>
            </div>
          </Toolbar>
          <Collapse in={this.state.reviewExpanded} transitionDuration='auto' unmountOnExit>
            <List disablePadding>
              {this.props.spotReviews.length > 0 ? this.renderSpotReviews(this.props.spotReviews) : null}
            </List>
          </Collapse>
        </Card>
      </div>
    );
  }

  renderSpotReviews(reviews) {
    return reviews.map((review) => (
      <ListItem button key={review.id} onClick={() => this.props.handleReviewClick(review)}>
        <Avatar>
          <img src={review.author.profile_image_url} style={styles.reviewImage} />
        </Avatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography type='subheading' style={styles.listItemText}>
              {review.author.name}
            </Typography>
          }
          secondary={
            <Typography component='p' style={styles.listItemText} color='secondary'>
              {review.comment}
            </Typography>
          }
          style={styles.listItemContent}
        />
      </ListItem>
    ));
  }

  ableToPost(map) {
    if (!map) {
      return false;
    } else {
      return (map.following && (map.shared || map.editable));
    }
  }
}

export default SpotDetail;
