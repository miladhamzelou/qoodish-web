import React, { Component } from 'react';
import DeleteAccountDialogContainer from '../containers/DeleteAccountDialogContainer';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = {
  rootLarge: {
    padding: 40,
    margin: '0 auto',
    marginTop: 64,
    maxWidth: 600,
    minWidth: 320
  },
  rootSmall: {
    padding: 20,
    margin: '0 auto',
    marginTop: 56
  },
  deleteButton: {
    color: 'white',
    backgroundColor: 'red'
  }
};

export default class Invites extends Component {
  componentWillMount() {
    this.props.updatePageTitle();
    gtag('config', process.env.GA_TRACKING_ID, {
      'page_path': '/settings',
      'page_title': 'Settings | Qoodish'
    });
  }

  render() {
    return (
      <div style={this.props.large ? styles.rootLarge : styles.rootSmall}>
        <Card>
          <CardContent>
            <Typography variant="headline" component="h2" gutterBottom>
              Delete Account
            </Typography>
            <Typography component="p">
              This cannot be undone. Really.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="raised"
              onClick={this.props.handleDeleteAccountButtonClick}
              style={styles.deleteButton}
            >
              Delete Account
            </Button>
          </CardActions>
        </Card>
        <DeleteAccountDialogContainer />
      </div>
    );
  }
}
