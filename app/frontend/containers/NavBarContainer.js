import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';
import NavBar from '../ui/NavBar';
import requestStart from '../actions/requestStart';
import requestFinish from '../actions/requestFinish';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import ApiClient from './ApiClient';
import fetchNotifications from '../actions/fetchNotifications';
import readNotification from '../actions/readNotification';
import { sleep } from './Utils';
import switchMyMaps from '../actions/switchMyMaps';
import switchFollowingMaps from '../actions/switchFollowingMaps';
import openFeedbackDialog from '../actions/openFeedbackDialog';
import openDrawer from '../actions/openDrawer';
import closeDrawer from '../actions/closeDrawer';
import signIn from '../actions/signIn';

const mapStateToProps = state => {
  return {
    currentUser: state.app.currentUser,
    large: state.shared.large,
    pageTitle: state.shared.pageTitle,
    notifications: state.shared.notifications,
    unreadNotifications: state.shared.unreadNotifications,
    showBackButton: state.shared.showBackButton,
    pathname: state.router.location.pathname,
    mapsTabActive: state.shared.mapsTabActive,
    mapsTabValue: state.maps.tabValue,
    previous: state.shared.previous,
    drawerOpen: state.shared.drawerOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleMount: async () => {
      const client = new ApiClient();
      let response = await client.fetchNotifications();
      if (response.ok) {
        let notifications = await response.json();
        dispatch(fetchNotifications(notifications));
      }
    },

    signOut: async () => {
      dispatch(requestStart());

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const messaging = firebase.messaging();
        const registrationToken = await messaging.getToken();
        if (registrationToken) {
          const client = new ApiClient();
          await client.deleteRegistrationToken(registrationToken);
        }
      }

      await firebase.auth().signOut();
      await firebase.auth().signInAnonymously();
      const currentUser = firebase.auth().currentUser;
      const user = {
        uid: currentUser.uid,
        isAnonymous: true
      };
      dispatch(signIn(user));

      dispatch(push('/login'));
      dispatch(requestFinish());
    },

    readNotifications: async notifications => {
      await sleep(5000);
      const client = new ApiClient();
      let unreadNotifications = notifications.filter(notification => {
        return notification.read === false;
      });
      unreadNotifications.forEach(async notification => {
        let response = await client.readNotification(notification.id);
        if (response.ok) {
          let notification = await response.json();
          dispatch(readNotification(notification));
        }
        await sleep(3000);
      });
    },

    handleBackButtonClick: (previous) => {
      if (previous) {
        dispatch(goBack());
      } else {
        dispatch(push('/'));
      }
    },

    handleFollowingMapsTabClick: () => {
      dispatch(switchFollowingMaps());
    },

    handleMyMapsTabClick: () => {
      dispatch(switchMyMaps());
    },

    handleFeedbackClick: () => {
      dispatch(openFeedbackDialog());
    },

    handleOpenDrawer: () => {
      dispatch(openDrawer());
    },

    handleCloseDrawer: () => {
      dispatch(closeDrawer());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
