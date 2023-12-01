/* eslint-disable no-shadow */
import React, { useEffect, useState, useRef } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

import { zhCN } from '@mui/material/locale';
import { useHotkeys } from 'react-hotkeys-hook';

import usePlayer from '@hooks/usePlayer';
import { useNoxSetting } from '@APM/stores/useApp';
import useFav from '@hooks/useFav';
import { skinPreset } from '../../styles/skin';
import RandomGIFIcon from '../buttons/RandomGIF';
import { readLocalStorage } from '../../utils/ChromeStorage';
import FavSettingsButtons from './FavSetting/FavSettingsButton';
import SongSearchBar from '../dialogs/SongSearchbar';
import Menu from './Favmenu';
import SongRenameDialog from '../dialogs/SongRenameDialog';
import { ScrollBar } from '../../styles/styles';

import FavTableActions from './SongListTableActions';
import SongRow from './SongRow';

const { colorTheme } = skinPreset;

export const Fav = function Fav({
  FavList,
  handleDeleteFromSearchList,
  handleAddToFavClick,
  rssUpdate,
}) {
  const updatePlaylist = useNoxSetting((state) => state.updatePlaylist);
  const playlistShouldReRender = useNoxSetting(
    (state) => state.playlistShouldReRender,
  );
  const playerSetting = useNoxSetting((state) => state.playerSetting);
  const { onPlayOneFromFav } = usePlayer({});

  const [page, setPage] = useState(0);
  const defaultRowsPerPage = Math.max(
    1,
    Math.floor((window.innerHeight - 305) / 40),
  );
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const searchBarRef = useRef({ current: {} });
  const currentPlayingId = useNoxSetting((state) => state.currentPlayingId);

  const [songObjEdited, setSongObjEdited] = useState({
    bvid: '',
    parsedName: '',
    index: '',
  });
  const [songEditDialogOpen, setSongEditDialogOpen] = useState(false);

  const { rows, setRows, handleSearch } = useFav(FavList);

  useHotkeys('left', () => handleChangePage(null, page - 1));
  useHotkeys('right', () => handleChangePage(null, page + 1));

  const saveCurrentList = () => updatePlaylist(FavList);

  /**
   * because of delayed state update/management, we need a reliable way to get
   * the current playlist songs (which may be filtered by some search string).
   * this method returns the accurate current playlist's songs.
   * @returns rows when FavList is the same as the Favlist props; or Favlist.songlist
   */
  const getCurrentRow = () => {
    if (FavList !== null && rows !== null) {
      return rows;
    }
    return FavList.songList;
  };

  /**
   * this method primes the current page displaying songs to the one containing the song
   * that is currently in play. the current song is found by reading the locally stored
   * value "currentPlaying". this function is in a useEffect.
   */
  const primePageToCurrentPlaying = () => {
    try {
      const songList = getCurrentRow();
      readLocalStorage('CurrentPlaying').then((r) => {
        for (let i = 0, n = songList.length; i < n; i++) {
          if (songList[i].id === r.cid) {
            setPage(Math.floor(i / defaultRowsPerPage));
            break;
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setRowsPerPage(defaultRowsPerPage);
    primePageToCurrentPlaying();
    performSearch('');
  }, [FavList.id]);

  /**
   * forcefully search a string in the playlist.
   * setting the searchbar ref's value directly is bugged with
   * the visual update of textfield's label; otherwise works just fine.
   * @param {string} searchedVal
   */
  const performSearch = (searchedVal) => {
    setTimeout(() => {
      searchBarRef.current.value = searchedVal;
    }, 100);
    handleSearch(searchedVal);
  };

  const handleChangePage = (event, newPage) => {
    const maxPage = Math.ceil(rows.length / rowsPerPage);
    if (newPage < 0) newPage = 0;
    else if (newPage >= maxPage) newPage = maxPage - 1;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const className = ScrollBar().root;

  const favListReloadBVid = (bvid) => {
    FavList.songList = FavList.songList.filter((x) => x.bvid !== bvid);
    rssUpdate([bvid]);
  };

  const openSongEditDialog = (songObj) => {
    setSongObjEdited(songObj);
    setSongEditDialogOpen(true);
  };

  return (
    <React.Fragment>
      <SongRenameDialog
        openState={songEditDialogOpen}
        songObj={songObjEdited}
        onClose={() => setSongEditDialogOpen(false)}
        saveList={saveCurrentList}
      />
      {FavList && (
        <React.Fragment>
          <Menu theme={colorTheme.generalTheme} />
          <Box
            sx={{ flexGrow: 1, maxHeight: '80px' }}
            style={{ paddingBottom: '8px' }}
          >
            <Grid container spacing={2} style={{ padding: '10px' }}>
              <Grid
                item
                xs={5}
                style={{
                  textAlign: 'left',
                  padding: '0px',
                  paddingLeft: '12px',
                  paddingTop: '12px',
                }}
                overflow='hidden'
              >
                <Typography
                  variant='h6'
                  style={{
                    color: colorTheme.playlistCaptionColor,
                    whiteSpace: 'nowrap',
                    fontSize: '2rem',
                  }}
                >
                  {FavList.title}
                </Typography>
              </Grid>
              <Grid item xs={2} style={{ textAlign: 'center', padding: '0px' }}>
                <RandomGIFIcon
                  gifs={skinPreset.gifs}
                  favList={FavList.id + page.toString()}
                  onClickCallback={primePageToCurrentPlaying}
                />
              </Grid>
              <Grid item xs={5} style={{ textAlign: 'right', padding: '10px' }}>
                {!FavList.id.includes('Special') && (
                  <FavSettingsButtons
                    currentList={FavList}
                    rssUpdate={async (subscribeUrls) => {
                      const val = await rssUpdate(subscribeUrls);
                      if (val !== null) setRows(val.songList);
                    }}
                  />
                )}
                <SongSearchBar handleSearch={handleSearch} ref={searchBarRef} />
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            className={className}
            id='FavTable'
            component={Paper}
            sx={{ maxHeight: 'calc(100% - 65px)' }}
            style={{
              overflow: 'auto',
              boxShadow: colorTheme.songListShadowStyle,
              backgroundColor: colorTheme.FavBackgroundColor,
            }}
          >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        width: column.minWidth,
                        paddingLeft: column.paddingLeft,
                        padding: column.padding,
                      }}
                      style={{
                        backgroundColor:
                          colorTheme.FavBackgroundColorSolid === undefined
                            ? colorTheme.FavBackgroundColor
                            : colorTheme.FavBackgroundColorSolid,
                        color: colorTheme.songListColumnHeaderColor,
                      }}
                    >
                      {column.label}
                      {column.id === 'name' ? `(${rows.length})` : ''}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : rows
                ).map((song, index) => (
                  <SongRow
                    song={song}
                    index={index}
                    playlist={FavList}
                    performSearch={performSearch}
                    handleDeleteFromSearchList={handleDeleteFromSearchList}
                    favListReloadBVid={favListReloadBVid}
                    openSongEditDialog={openSongEditDialog}
                    playSong={(v) =>
                      onPlayOneFromFav(v, {
                        ...FavList,
                        songList: playerSetting.keepSearchedSongListWhenPlaying
                          ? rows
                          : FavList.songList,
                      })
                    }
                    searchBarRef={searchBarRef}
                    handleAddToFavClick={handleAddToFavClick}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <ThemeProvider theme={theme}>
                    <TablePagination
                      rowsPerPageOptions={[
                        defaultRowsPerPage,
                        99,
                        FavList.songList.length,
                      ]}
                      colSpan={3}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={FavTableActions}
                      style={{ color: colorTheme.playListIconColor }}
                    />
                  </ThemeProvider>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  zhCN,
);

const columns = [
  { id: 'name', label: '歌曲名', minWidth: '20%' },
  {
    id: 'uploader',
    label: 'UP主',
    align: 'center',
    padding: '0px',
  },
  {
    id: 'operation',
    label: '操作',
    minWidth: '20%',
    align: 'right',
  },
];

export const songText = {
  fontSize: 16,
  minWidth: 0,
  overflow: 'hidden',
  paddingBottom: '4px',
  paddingTop: '4px',
};

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: colorTheme.FavAlternateBackgroundColor, // theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    padding: 0,
  },
}));
