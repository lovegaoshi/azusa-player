import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { searchSongOnWeb, searchSongOnBili } from '../Fav/Favmenu';
import { AddFavDialog } from '../dialogs/AddFavDialog';

export default function mobileMoreButton({ song }: { song: NoxMedia.Song }) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(
    null as Element | null | undefined,
  );
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title='帮助'>
        <IconButton
          size='large'
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenAddDialog(true);
            handleClose();
          }}
        >
          将歌送往歌单……
        </MenuItem>
        <MenuItem onClick={handleClose}>console.log</MenuItem>
        <MenuItem
          onClick={() => {
            searchSongOnWeb(song);
            handleClose();
          }}
        >
          在网上搜索这首歌
        </MenuItem>
        <MenuItem
          onClick={() => {
            searchSongOnBili(song);
            handleClose();
          }}
        >
          在b站搜索这首歌
        </MenuItem>
        <MenuItem onClick={handleClose}>在所有歌单中删除这首歌</MenuItem>
      </Menu>
      <AddFavDialog
        openState={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        song={song}
        fromId={undefined}
        isMobile
      />
    </React.Fragment>
  );
}
