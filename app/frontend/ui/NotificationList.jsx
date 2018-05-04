import React from 'react';
import moment from 'moment';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';

const styles = {
  notificationText: {
    paddingRight: 32
  },
  secondaryAvatar: {
    borderRadius: 0,
    marginRight: 12
  }
};

export default class NotificationList extends React.Component {
  componentWillMount() {
    this.props.readNotifications(this.props.notifications);
  }

  render() {
    return (
      <List>
        {this.renderNotifications(this.props.notifications)}
      </List>
    );
  }

  renderNotifications(notifications) {
    return notifications.map(notification => (
      <ListItem
        onClick={() => {
          this.props.handleNotificationClick(notification);
        }}
        key={notification.id}
        button
      >
        <Avatar src={notification.notifier.profile_image_url} />
        <ListItemText
          primary={this.renderNotificationText(notification)}
          secondary={
            <div>{this.fromNow(notification)}</div>
          }
        />
        {notification.notifiable.thumbnail_url && (
          <ListItemSecondaryAction>
            <Avatar src={notification.notifiable.thumbnail_url} style={styles.secondaryAvatar} />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    ));
  }

  renderNotificationText(notification) {
    if (notification.key == 'invited') {
      return (
        <div style={styles.notificationText}>
          <b>{notification.notifier.name}</b> {notification.key} you to{' '}
          {notification.notifiable.type}.
        </div>
      );
    } else {
      return (
        <div style={styles.notificationText}>
          <b>{notification.notifier.name}</b> {notification.key} your{' '}
          {notification.notifiable.type}.
        </div>
      );
    }
  }

  fromNow(notification) {
    return moment(notification.created_at, 'YYYY-MM-DDThh:mm:ss.SSSZ')
      .locale(window.currentLocale)
      .fromNow();
  }
}