import React, { useState, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import ReviewLikeActions from './ReviewLikeActions';

import ApiClient from '../../utils/ApiClient';
import editReview from '../../actions/editReview';
import openToast from '../../actions/openToast';
import openSignInRequiredDialog from '../../actions/openSignInRequiredDialog';
import I18n from '../../utils/I18n';

const styles = {
  root: {
    width: '100%'
  },
  actions: {
    display: 'flex',
    width: '100%',
    alignItems: 'center'
  },
  textField: {
    justifyContent: 'center',
    marginLeft: 16
  },
  commentActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  avatar: {
    width: 24,
    height: 24
  }
};

const UserAvatar = React.memo(() => {
  const currentUser = useMappedState(
    useCallback(state => state.app.currentUser, [])
  );

  if (currentUser.isAnonymous) {
    return (
      <Avatar style={styles.avatar}>
        <PersonIcon />
      </Avatar>
    );
  } else {
    return (
      <Avatar
        src={currentUser.thumbnail_url}
        alt={currentUser.name}
        style={styles.avatar}
      />
    );
  }
});

const ReviewCardActions = React.memo(props => {
  const [commentFormActive, setCommentFormActive] = useState(false);
  const [comment, setComment] = useState(undefined);
  const [sending, setSending] = useState(false);

  const currentUser = useMappedState(
    useCallback(state => state.app.currentUser, [])
  );

  const dispatch = useDispatch();

  const handleSendCommentButtonClick = useCallback(async () => {
    if (currentUser.isAnonymous) {
      dispatch(openSignInRequiredDialog());
      return;
    }

    setSending(true);
    const client = new ApiClient();
    let response = await client.sendComment(props.review.id, comment);
    if (response.ok) {
      dispatch(openToast(I18n.t('added comment')));
      let review = await response.json();
      dispatch(editReview(review));
    } else {
      dispatch(openToast(I18n.t('comment failed')));
    }
    setCommentFormActive(false);
    setComment(undefined);
    setSending(false);
  });

  return (
    <div style={styles.root}>
      <div style={styles.actions}>
        <UserAvatar />
        <TextField
          fullWidth
          placeholder={I18n.t('add comment')}
          InputProps={{
            disableUnderline: true
          }}
          style={styles.textField}
          onFocus={() => setCommentFormActive(true)}
          autoFocus={commentFormActive}
          multiline={commentFormActive}
          onChange={e => setComment(e.target.value)}
        />
        {!commentFormActive && <ReviewLikeActions target={props.review} />}
      </div>
      {commentFormActive && (
        <div style={styles.commentActions}>
          <Button
            onClick={() => {
              setCommentFormActive(false);
              setComment(undefined);
            }}
          >
            {I18n.t('cancel')}
          </Button>
          <Button
            onClick={handleSendCommentButtonClick}
            color="primary"
            disabled={!comment || sending}
          >
            {I18n.t('post')}
          </Button>
        </div>
      )}
    </div>
  );
});

export default React.memo(ReviewCardActions);
