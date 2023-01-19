
import { AzusaTheme } from './azusa';
const gifs = [
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/spin.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/cake2.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/shark_rap.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/vacuum.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/fitness_shark.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/taiko_shark.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/a_way_out.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/books.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/boating.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/karaoke.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/rhythm_gaming.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/plug_play.gif?raw=true',
  'https://github.com/jonowo/walfie-gif-dl/blob/main/gifs/supermarket.gif?raw=true',
];  
export const GuraTheme = {
    playerBanner: 'https://raw.githubusercontent.com/lovegaoshi/azusa-player/nox-player/public/img/Gura/GuraBanner.png',
    playerBannerMobile: 'https://cdn.donmai.us/sample/00/1f/__gawr_gura_hololive_and_1_more_drawn_by_wellski__sample-001ff8e45cea2114844c7114988d7cff.jpg', 
    playerBackground: 'https://konachan.com/image/4181f11e3cf92c84f3c9600245631972/Konachan.com%20-%20316909%20animal%20aqua_eyes%20dress%20fish%20flat_chest%20gawr_gura%20hase_neet%20hololive%20hoodie%20short_hair%20tail%20water%20weapon%20white_hair.jpg',
    //'https://cdn.donmai.us/sample/0d/19/__gawr_gura_and_bloop_hololive_and_1_more_drawn_by_rukako__sample-0d19f403ca5f21106aa2a6cbd1afdb80.jpg',
    // https://cdn.donmai.us/sample/98/69/__gawr_gura_hololive_and_1_more_drawn_by_gueya__sample-98697219522d92d9b39ed6c79d09c456.jpg
    gifs,
    gifIcon: () => {
        return gifs[Math.floor(Math.random() * gifs.length)>>0]
    },
    appTitle: 'Gura-player',
    colorTheme: {
        // these are adapted from the original azusa player; eventually will be trnaslated into palettes.
        // color for icons such as add to current playlist, on the right panel
        playListIconColor: '#1e90ff',
        songListIconColor: '#1e90ff',
        iconDisableColor: '#adadad',
        // colors for playlist caption on the right panel
        myPlayListCaptionColor: '#1e90ff',
        // similar to above; depreciating?
        playlistCaptionColor: '#1e90ff',
        // color for icons on hte left panel. depreciating?
        songListColumnHeaderColor: 'black',
        // color for icons on hte left panel. depreciating?
        songIconColor: '#1e90ff',
        // colors for song caption on the left panel. depreciating?
        uploaderCaptionColor: '#1e90ff',
        lyricActiveColor: '#c660e7',
        lyricInactiveColor: '#4d388f',
        songListShadowStyle: "-4px 5px 6px 2px #1e90ff, 4px -3px 2px 0px #0070ff, 1px 1px 0px 2px #87ceeb",
        lyricImgShadowStyle: " #725af866 5px 5px, #985cf14d 10px 10px, #925af730 15px 15px, #ac7ff01a 20px 20px, #9477e50d 25px 25px",
        PCBackgroundColor: undefined,
        MobileBackgroundColor: 'white',
        FavBackgroundColor: "rgba(255,255,255,0.9)",
        FavBackgroundColorSolid: "rgba(255,255,255,1)",
        FavAlternateBackgroundColor: "rgba(242,242,242,0.5)",
        scrollbarColor: '#1e90ff',
        favMobileBorder: "1px solid #1e90ff",
        clickHoldBackground: 'lightgrey',
        palette: {
            palette: {
              primary: {
                // light: will be calculated from palette.primary.main,
                main: '#1e90ff',
              },
              secondary: {
                // light: will be calculated from palette.primary.main,
                main: '#1e90ff',
              },
            },
            components: {
              MuiListItemButton: {
                styleOverrides: {
                    root: {
                        color: '#1e90ff ',
                    }
                },
              },
            }
        },
    },
    reactJKPlayerTheme: {
      sliderColor: '#1e90ff',
    },
    maintainer: 'lovegaoshi@github',
    maintainerTooltip: "A",
};