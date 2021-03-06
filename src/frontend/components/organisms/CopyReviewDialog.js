import React, { useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import I18n from '../../utils/I18n';

import ApiClient from '../../utils/ApiClient';
import closeCopyReviewDialog from '../../actions/closeCopyReviewDialog';
import openToast from '../../actions/openToast';
import requestStart from '../../actions/requestStart';
import requestFinish from '../../actions/requestFinish';
import createReview from '../../actions/createReview';
import fetchPostableMaps from '../../actions/fetchPostableMaps';
import uploadToStorage from '../../utils/uploadToStorage';
import deleteFromStorage from '../../utils/deleteFromStorage';
import downloadImage from '../../utils/downloadImage';

const CopyReviewDialog = () => {
  const mapState = useCallback(
    state => ({
      dialogOpen: state.reviews.copyReviewDialogOpen,
      postableMaps: state.maps.postableMaps,
      review: state.reviews.targetReview
    }),
    []
  );
  const { dialogOpen, postableMaps, review } = useMappedState(mapState);
  const dispatch = useDispatch();

  const handleRequestClose = useCallback(() => {
    dispatch(closeCopyReviewDialog());
  });
  const handleOnEnter = useCallback(async () => {
    const client = new ApiClient();
    let response = await client.fetchPostableMaps();
    if (response.ok) {
      let maps = await response.json();
      dispatch(fetchPostableMaps(maps));
    }
  });
  const handleMapSelected = useCallback(async map => {
    dispatch(requestStart());
    const params = {
      comment: review.comment,
      place_id: review.place_id
    };
    let fileName;
    if (review.image) {
      const blob = await downloadImage(review.image.url);
      const uploadResponse = await uploadToStorage(blob);
      params.image_url = uploadResponse.imageUrl;
      fileName = uploadResponse.fileName;
    }
    const client = new ApiClient();
    let response = await client.createReview(map.id, params);
    let json = await response.json();
    dispatch(requestFinish());
    if (response.ok) {
      dispatch(closeCopyReviewDialog());
      dispatch(createReview(json));
      dispatch(openToast(I18n.t('copy report success')));
      gtag('event', 'create', {
        event_category: 'engagement',
        event_label: 'review'
      });
    } else {
      dispatch(openToast(json.detail));
      if (fileName) {
        deleteFromStorage(fileName);
      }
    }
  });

  return (
    <Dialog
      open={dialogOpen}
      onEnter={handleOnEnter}
      onClose={handleRequestClose}
      fullWidth
    >
      <DialogTitle>{I18n.t('select map to copy this report to')}</DialogTitle>
      <DialogContent>
        {postableMaps.map(map => (
          <ListItem button key={map.id} onClick={() => handleMapSelected(map)}>
            <Avatar src={map.thumbnail_url} />
            <ListItemText primary={map.name} />
          </ListItem>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRequestClose}>{I18n.t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(CopyReviewDialog);
