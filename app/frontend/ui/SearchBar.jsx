import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import I18n from '../containers/I18n';
import { Link } from 'react-router-dom';

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 150,
      '&:focus': {
        width: 200
      }
    }
  },
  paper: {
    position: 'absolute'
  },
  avatar: {
    width: 32,
    height: 32
  }
});

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = {
      listOpen: false
    };
  }

  handleInputChange(input) {
    let listOpen;
    if (input) {
      listOpen = true;
    } else {
      listOpen = false;
    }
    this.setState({
      listOpen: listOpen
    });

    if (this.props.loadingPlaces || !input) {
      return;
    }
    this.props.handleInputChange(input);
  }

  handleRequestClose() {
    this.setState({
      listOpen: false
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder={I18n.t("search map")}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          type="search"
          onChange={(e) => this.handleInputChange(e.target.value)}
        />
        {this.state.listOpen &&
          <Paper className={classes.paper}>
            {this.renderMaps()}
          </Paper>
        }
      </div>
    );
  }

  renderMaps() {
    const { classes } = this.props;
    return this.props.pickedMaps.map(map => (
      <MenuItem
        component={Link}
        to={`/maps/${map.id}`}
        key={map.id}
        onClick={this.handleRequestClose}
      >
        <Avatar alt={map.name} src={map.thumbnail_url} className={classes.avatar} />
        <ListItemText primary={map.name} />
      </MenuItem>
    ));
  }
}

export default withStyles(styles)(SearchBar);