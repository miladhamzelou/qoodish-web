import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Button from '@material-ui/core/Button';

const styles = {
  container: {
    display: 'flex'
  },
  likesButton: {
    minWidth: 'auto'
  }
};

const LikeButton = React.memo(props => {
  return (
    <IconButton
      onClick={() => {
        props.target && props.target.liked
          ? props.handleUnlikeButtonClick()
          : props.handleLikeButtonClick();
      }}
    >
      {props.target && props.target.liked ? (
        <FavoriteIcon color="error" />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  );
});

const LikesBadge = React.memo(props => {
  return (
    <Button
      size="small"
      onClick={props.handleLikesClick}
      style={styles.likesButton}
    >
      {props.target && props.target.likes_count}
    </Button>
  );
});

const SharedLikeActions = props => {
  return (
    <div style={styles.container}>
      <LikeButton {...props} />
      {props.target && props.target.likes_count > 0 && (
        <LikesBadge {...props} />
      )}
    </div>
  );
};

export default React.memo(SharedLikeActions);
