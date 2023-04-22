import skinTemplate, { randomChoice } from './template';

const gifs = [
  'https://i0.hdslb.com/bfs/garb/item/f26e50aa169a95c08caf0550d637045247911719.png',
  'https://i0.hdslb.com/bfs/garb/item/2cd93e68680a661740158bf926aaf05bb43ca131.png',
  'https://i0.hdslb.com/bfs/garb/item/6dda219acdb584b0791200c30a651f60b1d29fc7.png',
  'https://i0.hdslb.com/bfs/garb/item/59085d848cb90b5721a1497e771018a247dd341f.png',
  'https://i0.hdslb.com/bfs/garb/item/e6b00bc4441a49aae505f2d4dc21e36ca7af4739.png',
  'https://i0.hdslb.com/bfs/garb/item/f2e2973c16ddc636f11484b782903d27f4ef25f0.png',
  'https://i0.hdslb.com/bfs/garb/item/6a8bfae4e329ac376f4feb42f23dfb8dcbc276ab.png',
  'https://i0.hdslb.com/bfs/garb/item/1cb97ad31ea40cccd1b9f099a9465f296fc8766a.png',
  'https://i0.hdslb.com/bfs/garb/item/4628753090b253a2be0728130c8175d4d3794973.png',
  'https://i0.hdslb.com/bfs/garb/item/9d4d6c15132a59fac5ccb59deb6673dc89eb3ee4.png',
  'https://i0.hdslb.com/bfs/garb/item/8075e991c4bf1b68507456a3ea5a0f4d4d5200f6.png',
  'https://i0.hdslb.com/bfs/garb/item/615031aa73c6f0ce14c8ea55ce42cd2f0c5241f9.png',
  'https://i0.hdslb.com/bfs/garb/item/d4463badd9c8f026d30dd0ade230ecb8aee9b1d0.png',
  'https://i0.hdslb.com/bfs/garb/item/82079096c2502f384c3462903906e209246d74d6.png',
  'https://i0.hdslb.com/bfs/garb/item/d165f1c604f67c83a146fa287fc4ac1014e672ba.png',
  'https://i0.hdslb.com/bfs/garb/item/bc4f650df001e5b87f7b0db22e940246d7731fe0.png',
  'https://i0.hdslb.com/bfs/garb/item/fd6ddb798a23c0c724eb238a711dbb0efccee793.png',
  'https://i0.hdslb.com/bfs/garb/item/ebacec7ad1669624bfae530c88fa20532fc9e783.png',
  'https://i0.hdslb.com/bfs/garb/item/67f2a3e7586dcb38067bbc484aede0588b5ec3cd.png',
  'https://i0.hdslb.com/bfs/garb/item/4b8bad8d75d5cc08e6103749d2d743a7d66028fa.png',
  'https://i0.hdslb.com/bfs/garb/item/9a19eeac81f77414e239c478aed35d4f28bf38f9.png',
  'https://i0.hdslb.com/bfs/garb/item/c6246d97941b1e9aa1818b0356a4a8b56c00d2b3.png',
  'https://i0.hdslb.com/bfs/garb/item/fea9a28709ff6c3b5d77a2a36850b67205e82851.png',
  'https://i0.hdslb.com/bfs/garb/item/1fbfa0a7ffb494fb10c3ded3e2a4a7dfe28153fd.png',
  'https://i0.hdslb.com/bfs/garb/item/42b5c3b8f41e804c3e045df69d9d0a4a8f2c399c.png',

];

const randomPortraitBackground = randomChoice([
  'https://i0.hdslb.com/bfs/garb/item/17f365d114f3a2749f3dde71b5f555fd4474ca9c.jpg',
  'https://i0.hdslb.com/bfs/garb/item/02257d22c49f8071394257131fdeae76e8b1dcf5.jpg',
  'https://i0.hdslb.com/bfs/garb/item/db50d5af88010eb3e7f68eb1b741544756d2395a.jpg',
  'https://i0.hdslb.com/bfs/garb/item/037772406cfc4c12fd6bb45d9ec64ff281b35ed1.mp4',
]) as string;

export default skinTemplate({
  playerBanner: 'https://i0.hdslb.com/bfs/garb/item/4d1c96b086ff60d13e3a12d4e514baa028dbec1d.jpg',
  playerBannerMobile: async () => new Promise<string>((resolve) => { resolve(randomPortraitBackground); }),
  playerBackgroundMobileVideo: randomPortraitBackground.includes('.mp4'),
  playerBackground: async () => new Promise<string>((resolve) => { resolve('https://i2.hdslb.com/bfs/archive/ec91f760738bd0a7af955b4f2797d70f0fcab40a.jpg'); }),
  // playerBackground: async () => new Promise<string>((resolve) => { resolve('https://i0.hdslb.com/bfs/new_dyn/aae8c009d55b9db3472c1059b32cf16c1817527011.jpg'); }),
  gifs,
  gifIcon: () => randomChoice(gifs) as string,
  appTitle: '泽宝播放器',
  colorTheme: {
    generalTheme: 'dark',
    // color for icons such as add to current playlist, on the right panel
    playListIconColor: '#d3d3d3',
    songListIconColor: '#d3d3d3',
    iconDisableColor: '##adadad',
    // colors for playlist caption on the right panel
    myPlayListCaptionColor: '#d3d3d3',
    // similar to above; depreciating?
    playlistCaptionColor: 'red',
    // color for icons on hte left panel. depreciating?
    songIconColor: 'red',
    songListColumnHeaderColor: '#d3d3d3',
    // colors for song caption on the left panel. depreciating?
    uploaderCaptionColor: '#d3d3d3',
    lyricActiveColor: '#c660e7',
    lyricInactiveColor: '#4d388f',
    songListShadowStyle: '-4px 5px 6px 2px #ff0000, 4px -3px 2px 0px #ff0028, 1px 1px 0px 2px #ff2400',
    lyricImgShadowStyle: ' #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px',
    PCBackgroundColor: 'rgba(30,30,30,0.85)',
    MobileBackgroundColor: '#1E1E1E',
    FavBackgroundColor: 'rgba(30,30,30,0.5)',
    FavBackgroundColorSolid: 'rgba(30,30,30,1)',
    FavAlternateBackgroundColor: 'rgba(61,61,61,0.5)',
    scrollbarColor: '#dc143c',
    favMobileBorder: '1px solid white',
    clickHoldBackground: 'red',
    palette: {
      palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#dc143c',
          background: 'black',
          // dark: will be calculated from palette.primary.main,
          // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
          main: '#dc143c',
          // dark: will be calculated from palette.secondary.main,
          contrastText: '#ffcc00',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
      },
      components: {
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: '1.4em',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: '#1E1E1E',
              color: '#d3d3d3',
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
            },
          },
        },
        MuiDialogContentText: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              backgroundColor: '#1E1E1E',
              color: '#d3d3d3',
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              backgroundColor: '#1E1E1E',
              color: '#d3d3d3',
              '&.Mui-disabled': {
                backgroundColor: '#1E1E1E',
                color: '#d3d3d3',
              },
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              backgroundColor: '#1E1E1E',
              color: 'ivory',
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
            },
            input: {
              color: '#d3d3d3',
              '&.Mui-disabled': {
                color: '#d3d3d3',
                WebkitTextFillColor: 'rgba(211,211,211,0.35)',
              },
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            input: {
              color: '#d3d3d3',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              color: 'red',
              '&:hover': {
                backgroundColor: '#e8000d',
                color: '#d3d3d3',
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              color: 'red',
              '&:hover': {
                backgroundColor: '#e8000d',
                color: '#d3d3d3',
              },
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
              '&:hover': {
                backgroundColor: '#e8000d',
                color: '#d3d3d3',
              },
            },
          },
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              color: 'red',
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              color: '#d3d3d3',
            },
            icon: {
              color: '#d3d3d3',
            },
            nativeInput: {
              color: '#d3d3d3',
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              color: '#d3d3d3',
            },
          },
        },
        MuiFormControlLabel: {
          styleOverrides: {
            label: {
              color: '#d3d3d3',
            },
          },
        },
      },
    },
  },
  reactJKPlayerTheme: {
    sliderColor: 'red',
  },
  maintainer: '黑泽诺亚的五元店@bilibili',
  maintainerTooltip: '',
  maintinerURL: 'https://live.bilibili.com/251015',
});