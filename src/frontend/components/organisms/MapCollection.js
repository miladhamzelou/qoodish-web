import React from 'react';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import LockIcon from '@material-ui/icons/Lock';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '../molecules/Link';

import I18n from '../../utils/I18n';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%'
  },
  gridListHorizontal: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    width: '100%'
  },
  tileBar: {
    height: 90
  },
  followCheckButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    border: '1px solid #ffc107'
  },
  mapTypeIcon: {
    marginLeft: 16,
    marginRight: 16,
    color: '#fff',
    fontSize: '1.2rem'
  },
  mapTypeContainer: {
    display: 'grid'
  }
};

const MapCollection = props => {
  const large = useMediaQuery('(min-width: 600px)');

  return (
    <div style={styles.container}>
      <GridList
        cols={large ? 4 : props.horizontal ? 1.5 : 2}
        style={props.horizontal ? styles.gridListHorizontal : styles.gridList}
        spacing={large || props.horizontal ? 20 : 10}
        cellHeight={220}
      >
        {props.maps.map(map => (
          <GridListTile
            key={map.id}
            component={Link}
            to={`/maps/${map.id}`}
            title={map.name}
          >
            {map.following && (
              <Button
                variant="outlined"
                size="small"
                color="primary"
                style={styles.followCheckButton}
              >
                {I18n.t('following')}
              </Button>
            )}
            <img
              src={large ? map.image_url : map.thumbnail_url}
              alt={map.name}
            />
            <GridListTileBar
              title={map.name}
              subtitle={
                <div>
                  <Typography variant="body1" color="inherit" noWrap>
                    by: {map.owner_name}
                  </Typography>
                  <Typography variant="body1" color="inherit" noWrap>
                    {map.followers_count} {I18n.t('followers')}
                  </Typography>
                </div>
              }
              actionIcon={
                <div style={styles.mapTypeContainer}>
                  {map.private && <LockIcon style={styles.mapTypeIcon} />}
                </div>
              }
              style={styles.tileBar}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

export default React.memo(MapCollection);
