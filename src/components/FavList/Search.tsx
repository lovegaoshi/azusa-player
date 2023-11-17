/* eslint-disable react/require-default-props */
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

import { searchBiliURLs } from '@APM/utils/BiliSearch';

interface Props {
  handleSearch: (input: string) => void;
  handleOpenFav: () => void;
  playListIcon: JSX.Element;
  handleSetSearchInputVal: (input: string) => void;
}
export default function Search({
  handleSearch,
  handleOpenFav,
  playListIcon,
  handleSetSearchInputVal,
}: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [progressVal, setProgressVal] = useState(100);
  const [loading, setLoading] = useState(false);

  // TODO: type
  const onSearchTextChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const searchBili = async (input: string) => {
    setLoading(true);
    // handleSearch
    console.log(
      await searchBiliURLs({ input, progressEmitter: setProgressVal }),
    );
    setLoading(false);
  };

  const keyPress = (e: any) => {
    // Enter clicked
    if (e.keyCode === 13) {
      const input = e.target.value;
      // console.log('value', input); // Validation of target Val
      // Handles BV search
      searchBili(input);
    }
  };

  const progressBar = () => {
    if (loading) {
      return (
        <CircularProgress
          sx={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
          variant={progressVal === 100 ? 'indeterminate' : 'determinate'}
          value={progressVal}
        />
      );
    }
    return (
      <Tooltip title='搜索'>
        <IconButton
          size='large'
          onClick={() => {
            searchBili(searchValue);
            handleSetSearchInputVal(searchValue);
          }}
          sx={{ fontSize: '40px' }}
        >
          <SearchIcon fontSize='inherit' />
        </IconButton>
      </Tooltip>
    );
  };

  // <QueueMusicIcon fontSize='inherit'/>
  return (
    <Box // Top Grid -- Search
      sx={{
        gridArea: 'search',
      }}
    >
      <Box // Serch Grid -- SearchBox
        sx={{
          mx: 'auto',
          textAlign: 'left',
          overflow: 'hidden',
          height: '64px',
          paddingTop: '12px',
        }}
      >
        <FavListButton loading={loading} handleOpenFav={handleOpenFav}>
          {playListIcon}
        </FavListButton>
        <TextField
          id='outlined-basic'
          label='搜索b站url'
          onKeyDown={keyPress}
          onChange={onSearchTextChange}
          value={searchValue}
          type='search'
          sx={{ width: '55%' }}
        />
        {progressBar()}
      </Box>
    </Box>
  );
}

interface FavListButtonProps {
  handleOpenFav?: () => void;
  loading: boolean;
  children: JSX.Element;
}

function FavListButton({
  handleOpenFav,
  loading,
  children,
}: FavListButtonProps) {
  if (!handleOpenFav) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <IconButton
      size='large'
      onClick={() => {
        handleOpenFav();
      }}
      sx={{ fontSize: '40px', marginTop: loading ? '-42px' : '0px' }}
    >
      {children}
    </IconButton>
  );
}