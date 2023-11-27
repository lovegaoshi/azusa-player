import React, { useCallback, memo, useContext } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { contextMenu } from 'react-contexify';

import { defaultSearchList } from '@objects/Playlist';
import { useNoxSetting } from '@APM/stores/useApp';
import Search from './Search';
import { skinPreset } from '../../styles/skin';
import PlayerSettingsButton from '../setting/PlayerSetttingsButton';
import HelpPanelButton from '../buttons/HelpPanelButton';
import Menu from '../menus/Favlistmenu';
import { StorageManagerCtx } from '../../contexts/StorageManagerContext';
import { AddFavDialog, NewFavDialog } from '../dialogs/AddFavDialog';
import { ScrollBar } from '../../styles/styles';
import { Fav } from '../Fav/Fav';
import useFavList from '../../hooks/useFavList';

const { colorTheme } = skinPreset;

export const outerLayerBtn = { padding: 'unset' };

export const CRUDBtn = {
  ':hover': {
    cursor: 'default',
  },
  paddingLeft: '8px',
  paddingRight: '8px',
};

const CRUDIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1.1em',
  height: '1.1em',
  paddingBottom: '2px',
  color: colorTheme.playListIconColor,
};

const AddFavIcon = {
  ':hover': {
    cursor: 'pointer',
  },
  width: '1em',
  color: colorTheme.playListIconColor,
};

export const DiskIcon = {
  minWidth: '36px',
};

export const FavList = memo(
  ({
    onSongListChange,
    onPlayOneFromFav,
    onPlayAllFromFav,
    onAddFavToList,
    playerSettings,
  }) => {
    const playlists = useNoxSetting((state) => state.playlists);
    const playlistIds = useNoxSetting((state) => state.playlistIds);
    const StorageManager = useContext(StorageManagerCtx);
    const {
      favLists,
      setFavLists,
      searchList,
      setSearchList,
      favoriteList,
      selectedList,
      setSelectedList,
      setSongsStoredAsNewFav,
      openNewDialog,
      setOpenNewDialog,
      openAddDialog,
      actionFavId,
      actionFavSong,
      setSearchInputVal,

      handleDeleteFromSearchList,
      onNewFav,
      handleDeleteFavClick,
      handleAddToFavClick,
      onAddFav,
      onDragEnd,
      updateSubscribeFavList,
    } = useFavList();
    const handleSearch = useCallback(
      (list) => {
        setSearchList(list);
        setSelectedList(list);
      },
      [searchList, selectedList],
    );

    const handlePlayListClick = (FavList2) => {
      onPlayAllFromFav(FavList2);
    };

    const loadToSearchList = (songList) => {
      handleSearch(defaultSearchList({ songList }));
      onPlayAllFromFav({ songList });
    };

    const shuffleAll = () => {
      let totalSongs = 0;
      favLists.map((favList) => (totalSongs += favList.songList.length));
      const allFavSongList = new Array(totalSongs);
      let i = 0;
      for (const favList of favLists) {
        for (const song of favList.songList) {
          allFavSongList[i] = { ...song, singer: favList.title };
          i++;
        }
      }
      loadToSearchList(allFavSongList);
    };

    const renderFavListItem = ({ v, i }) => {
      return (
        <React.Fragment key={i}>
          <ListItemButton
            disableRipple
            sx={outerLayerBtn}
            onContextMenu={(event, row, index) => {
              event.preventDefault();
              contextMenu.show({
                id: 'favlistmenu',
                event,
                props: {
                  favlist: v,
                  updateFavList: (val) => {
                    const newList = { ...val };
                    StorageManager.updateFavList(newList);
                    // well, we resorted back to this...
                    setSelectedList(null);
                    setSelectedList(newList);
                  },
                },
              });
            }}
          >
            <ListItemButton
              style={{ maxWidth: 'calc(100% - 84px)' }}
              onClick={() => setSelectedList(v)}
              id={v.id}
            >
              <ListItemIcon sx={DiskIcon}>
                <AlbumOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: '1.1em' }}
                primary={v.title}
              />
            </ListItemButton>
            <Box component='div' sx={CRUDBtn}>
              <Tooltip title='播放歌单'>
                <PlaylistPlayIcon
                  sx={CRUDIcon}
                  onClick={() => handlePlayListClick(v)}
                />
              </Tooltip>
              <Tooltip title='添加到收藏歌单'>
                <AddBoxOutlinedIcon
                  sx={CRUDIcon}
                  onClick={() => handleAddToFavClick(v.id)}
                />
              </Tooltip>
              <Tooltip title='删除歌单'>
                <DeleteOutlineOutlinedIcon
                  sx={CRUDIcon}
                  onClick={() => handleDeleteFavClick(v.title, v.id)}
                />
              </Tooltip>
            </Box>
          </ListItemButton>
        </React.Fragment>
      );
    };

    const renderSpecialList = (specialList, handleClick = undefined) => {
      if (specialList === null) return;
      if (handleClick === undefined)
        handleClick = () => setSelectedList(specialList);

      return (
        <React.Fragment key={specialList.id}>
          <ListItemButton disableRipple sx={outerLayerBtn}>
            <ListItemButton
              style={{ maxWidth: 'calc(100% - 84px)' }}
              onClick={handleClick}
              id={specialList.id}
            >
              <ListItemIcon sx={DiskIcon}>
                <ManageSearchIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: '1.1em' }}
                primary={specialList.title}
              />
            </ListItemButton>
            <Box component='div' sx={CRUDBtn}>
              <Tooltip title='播放歌单'>
                <PlaylistPlayIcon
                  sx={CRUDIcon}
                  onClick={() => handlePlayListClick(specialList)}
                />
              </Tooltip>
              <Tooltip title='添加到收藏歌单'>
                <AddBoxOutlinedIcon
                  sx={CRUDIcon}
                  onClick={() => handleAddToFavClick(specialList.id)}
                />
              </Tooltip>
              <Tooltip title='新建为歌单'>
                <FiberNewIcon
                  sx={CRUDIcon}
                  onClick={() => {
                    setSongsStoredAsNewFav(specialList.songList);
                    setOpenNewDialog(true);
                  }}
                />
              </Tooltip>
            </Box>
          </ListItemButton>
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        <Menu theme={colorTheme.generalTheme} />
        <Search
          handleSearch={handleSearch}
          handleSetSearchInputVal={setSearchInputVal}
        />
        <br />
        <Box // Mid Grid -- SideBar
          style={{
            overflow: 'hidden',
            marginTop: '18px',
            maxHeight: 'calc(100vh - 208px)',
            backgroundColor: colorTheme.FavListBackgroundColor,
          }}
          sx={{ gridArea: 'sidebar' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography
                variant='subtitle1'
                style={{
                  color: colorTheme.myPlayListCaptionColor,
                  paddingLeft: '8px',
                  paddingTop: '12px',
                }}
              >
                我的歌单
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              style={{ textAlign: 'right', paddingRight: '8px' }}
            >
              <Tooltip title='全歌单播放'>
                <IconButton size='large' onClick={shuffleAll}>
                  <ShuffleIcon sx={AddFavIcon} />
                </IconButton>
              </Tooltip>
              <PlayerSettingsButton AddFavIcon={AddFavIcon} />
              <HelpPanelButton AddFavIcon={AddFavIcon} />
            </Grid>
            <NewFavDialog
              id='NewFav'
              keepMounted
              openState={openNewDialog}
              onClose={onNewFav}
            />
          </Grid>
          <Divider light />
          <List
            style={{ overflow: 'auto', maxHeight: 'calc(100% - 50px)' }}
            className={ScrollBar().root}
            sx={{ width: '100%' }}
            component='nav'
          >
            {renderSpecialList(searchList)}
            {false &&
              renderSpecialList(favoriteList, () =>
                StorageManager.getFavFavList().then(setSelectedList),
              )}
            {favLists && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='droppable'>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {favLists.map((item, index) => (
                        <Draggable
                          key={`item-${index}`}
                          draggableId={`item-${index}`}
                          index={index}
                        >
                          {(provided2, snapshot2) => (
                            <div
                              ref={provided2.innerRef}
                              {...provided2.draggableProps}
                              {...provided2.dragHandleProps}
                              style={{
                                background: snapshot2.isDragging
                                  ? colorTheme.clickHoldBackground
                                  : null,
                                ...provided2.draggableProps.style,
                              }}
                            >
                              {renderFavListItem({ v: item, i: index })}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </List>
        </Box>
        <Box // Mid Grid -- Fav Detail
          style={{
            maxHeight: '100%',
            paddingTop: '20px',
            paddingLeft: '20px',
            overflow: 'auto',
          }}
          sx={{ gridArea: 'Lrc', padding: '0.2em' }}
        >
          {selectedList && (
            <Fav
              FavList={selectedList}
              onSongListChange={onSongListChange}
              onSongIndexChange={onPlayOneFromFav}
              handleDeleteFromSearchList={handleDeleteFromSearchList}
              handleAddToFavClick={handleAddToFavClick}
              rssUpdate={(subscribeUrls) =>
                updateSubscribeFavList({
                  playlist: selectedList,
                  StorageManager,
                  setSelectedList,
                  subscribeUrls,
                })
              }
              playerSettings={playerSettings}
            />
          )}
        </Box>
        {favLists && (
          <AddFavDialog
            id='AddFav'
            openState={openAddDialog}
            onClose={onAddFav}
            fromId={actionFavId}
            favLists={playlistIds.map((favId) => ({
              id: playlists[favId].id,
              title: playlists[favId].id,
            }))}
            song={actionFavSong}
            MenuProps={{ style: { maxHeight: 200 } }}
          />
        )}
      </React.Fragment>
    );
  },
);