/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TerminalIcon from '@mui/icons-material/Terminal';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DownloadIcon from '@mui/icons-material/Download';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import 'react-contexify/dist/ReactContexify.css';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import { useConfirm } from 'material-ui-confirm';
import SyncIcon from '@mui/icons-material/Sync';

import bilivideoFetch, {
  fetchVideoInfo,
} from '@APM/utils/mediafetch/bilivideo';
import { removeSongBiliShazamed } from '@objects/Song';
import { syncFavlist } from '@utils/Bilibili/bilifavOperate';
import { biliShazamOnSonglist } from '@APM/utils/mediafetch/bilishazam';
import useFavList from '@hooks/useFavList';

const MENU_ID = 'favlistmenu';

/**
 * right-click context menu for FavList.
 * has menu items:
 * debug
 * @returns
 */
export default function App({ theme }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const { analyzeFavlist, cleanInvalidBVIds } = useFavList();
  const circularProgress = () => <CircularProgress />;

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  async function handleItemClick({ event, props, triggerEvent, data }) {
    console.warn('method not implemented', props.favlist);
  }

  async function syncFavlistToBilibili({ event, props, triggerEvent, data }) {
    const key = enqueueSnackbar(
      `正在同步歌单 ${props.favlist.title} 到b站收藏夹……`,
      { variant: 'info', persist: true, action: circularProgress },
    );
    closeSnackbar(key);
    if (await syncFavlist(props.favlist)) {
      enqueueSnackbar('done!', { variant: 'success', autoHideDuration: 2000 });
    } else {
      enqueueSnackbar('ERROR!', { variant: 'error', autoHideDuration: 2000 });
    }
  }

  function updateFavlist(
    props,
    msg,
    option = { variant: 'success', autoHideDuration: 2000 },
  ) {
    props.updateFavList(props.favlist);
    enqueueSnackbar(msg, option);
  }

  async function BiliShazam(
    { event, props, triggerEvent, data },
    options = { forced: false },
  ) {
    const key = enqueueSnackbar(
      `正在用b站识歌标识歌单 ${props.favlist.title}……`,
      { variant: 'info', persist: true, action: circularProgress },
    );
    try {
      props.favlist.songList = await biliShazamOnSonglist(
        props.favlist.songList,
        options.forced,
      );
    } catch (e) {
      console.warn(`b站识歌标识歌单 ${props.favlist.title} 失败`, e);
    }
    closeSnackbar(key);
    updateFavlist(props, `歌单 ${props.favlist.title} 已经用b站识歌更新乐！`);
  }

  function removeBiliShazam({ event, props, triggerEvent, data }) {
    props.favlist.songList.forEach((song) => removeSongBiliShazamed(song));
    updateFavlist(
      props,
      `歌单 ${props.favlist.title} 的b站识歌记录全部清除乐！`,
    );
  }

  function clearPlaylist({ event, props, triggerEvent, data }) {
    confirm({
      title: '清空歌单？',
      description: `确认要清空歌单 ${props.favlist.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(() => {
        props.favlist.songList = [];
        updateFavlist(props, `歌单 ${props.favlist.title} 清空乐！`);
      })
      .catch();
  }

  function reloadPlaylist({ event, props, triggerEvent, data }) {
    confirm({
      title: '重新载入歌单？',
      description: `确认要清空并重新载入歌单 ${props.favlist.title} 吗？`,
      confirmationText: '好的',
      cancellationText: '算了',
    })
      .then(async () => {
        const key = enqueueSnackbar(
          `正在重新载入歌单 ${props.favlist.title} 的bv号……`,
          { variant: 'info', persist: true, action: circularProgress },
        );
        const bvids = new Set();
        props.favlist.songList.forEach((song) => bvids.add(song));
        try {
          const songs = (
            await Promise.all(
              bvids.map((bvid) =>
                bilivideoFetch.regexFetch({ reExtracted: [0, bvid] }),
              ),
            )
          ).flat();
          props.favlist.songList = songs;
          updateFavlist(props, `歌单 ${props.favlist.title} 重载了！`);
        } catch {
          console.error('failed to reload playlist', props.favlist.title);
        } finally {
          closeSnackbar(key);
        }
      })
      .catch();
  }

  function displayMenu(e) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show({
      event: e,
    });
  }

  return (
    <div>
      <Menu id={MENU_ID} animation='slide' theme={theme}>
        <Item onClick={syncFavlistToBilibili}>
          <SyncIcon /> &nbsp; 同步到b站收藏夹
        </Item>
        <Item onClick={BiliShazam}>
          <YoutubeSearchedForIcon /> &nbsp; b站识歌
        </Item>
        <Item onClick={(props) => removeBiliShazam(props, {})}>
          <DeleteIcon /> &nbsp; 删除b站识歌
        </Item>
        <Item onClick={reloadPlaylist}>
          <RefreshIcon /> &nbsp; 从bv号重载歌单
        </Item>
        <Item onClick={clearPlaylist}>
          <ClearAllIcon /> &nbsp; 清空歌单
        </Item>
        <Item onClick={({ props }) => analyzeFavlist(props.favlist)}>
          <AnalyticsIcon /> &nbsp; 歌单统计
        </Item>
        <Item onClick={handleItemClick}>
          <DownloadIcon /> &nbsp; 导出bv号为csv
        </Item>
        <Item
          onClick={({ props }) =>
            cleanInvalidBVIds(props.favlist, circularProgress)
          }
        >
          <CleaningServicesIcon /> &nbsp; 清理失效的bv号
        </Item>
        <Item onClick={handleItemClick}>
          <TerminalIcon /> &nbsp; console.log
        </Item>
      </Menu>
    </div>
  );
}

App.defaultProps = {
  theme: 'light',
};