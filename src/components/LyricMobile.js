import React, { useEffect, useState, useCallback, useContext } from "react";
import { Lrc } from 'react-lrc';
import { ScrollBar } from "../styles/styles";

import TextField from "@mui/material/TextField";
import { withStyles } from '@mui/styles';
import Grid from "@mui/material/Grid";
import { reExtractSongName } from '../utils/re';
import { LyricSearchBar } from './LyricSearchBar';
import StorageManagerCtx from '../popup/App';
import { skinPreset } from '../styles/skin';

let colorTheme = skinPreset.colorTheme;

const INTERVAL_OF_RECOVERING_AUTO_SCROLL_AFTER_USER_SCROLL = 5000;

const styles = theme => ({
    inputOffset: {
        height: 40,
        width: 123,
    },
    inputLrc: {
        height: 40,
        width: 375,
    },
    inputSelect: {
        height: 40,
        width: 500,
    }
})

export const LyricMobile = withStyles(styles)((props) => {

    const [lyricOffset, setLyricOffset] = useState(0)
    const [lyric, setLyric] = useState('')
    const [songTitle, setSongTitle] = useState('')
    const [favListID, setFavListID] = useState(null)

    const { classes, currentTime, audioName, audioId, audioCover, artist } = props;
    const StorageManager = useContext(StorageManagerCtx)

    useEffect(() => {
        const extractedName = reExtractSongName(audioName, artist)
        console.debug('Lrc changed to %s', extractedName)
        // fetchLRC(audioName, setLyric, setSongTitle)
        setSongTitle(extractedName)
    }, [audioName])

    const onEnterPress = (e) => {
        // Enter clicked
        if (e.keyCode == 13) {
            setSongTitle(e.target.value)
        }
    }
    const onSongTitleChange = useCallback((lrc) => {
        setLyric(lrc)
    }, [audioName])

    const onLrcOffsetChange = (e) => {
        setLyricOffset(e.target.value)
        StorageManager.setLyricOffset(audioId, e.target.value)
    }

    function lineRenderer({ line: { startMillisecond, content }, index, active }) {
        // //console.log(content)
        return (
            <div style={{
                textAlign: 'center',
                color: active ? colorTheme.lyricActiveColor : colorTheme.lyricInactiveColor,
                padding: '6px 12px',
                fontSize: active ? '18px' : '15px',
                fontFamily: 'Georgia,\'Microsoft YaHei\',simsun,serif'
            }}>
                {content}
            </div>
        )
    }

    function onCurrentLineChange({ line, index }) {
        return (
            console.log(index, line)
        )
    }
    // //console.log(+currentTime * 1000 + +lyricOffset)
    const className = ScrollBar().root

    return (
        <React.Fragment>

            <Grid container spacing={1} sx={{ maxHeight: '100vh',minHeight: '100vh', overflow: 'hidden' }}>
                <Grid align="center" sx={{ alignItems: 'center', paddingBottom: 10, overflow: "hidden" }} item xs={12}>
                    <Grid container spacing={0} sx={{ maxHeight: '20vh', overflow: 'hidden', marginTop: '10px' }}>
                        <Grid align="center" sx={{ paddingTop: '8px', paddingLeft: '2px', overflow: "hidden" }} item xs={12}>
                            <Grid container spacing={0} sx={{ maxHeight: '20vh', overflow: 'hidden', width: '90vw' }}>
                                <Grid align="right" sx={{ paddingTop: '8px', paddingRight: '2px', overflow: "hidden" }} style={{ maxWidth: 'fit-content' }} item xs={3}>
                                    <TextField
                                        type="number"
                                        variant="outlined"
                                        label="歌词补偿(ms)"
                                        InputProps={{
                                            className: classes.inputOffset,
                                            min: -9999,
                                            max: 9999
                                        }}
                                        value={lyricOffset}
                                        onChange={onLrcOffsetChange}
                                    />
                                </Grid>
                                <Grid align="center" sx={{ paddingTop: '8px', paddingLeft: "8px", overflow: "hidden" }}  item xs={9}>
                                    <TextField
                                        variant="outlined"
                                        label="歌词搜索"
                                        InputProps={{
                                            className: classes.inputLrc,
                                        }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        placeholder={songTitle}
                                        onKeyDown={onEnterPress}
                                        type="search"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid align="center" sx={{ paddingTop: '8px', overflow: "hidden" , width: '90vw'}} item xs={12}>
                            <LyricSearchBar
                                SearchKey={songTitle}
                                SongId={audioId}
                                setLyricOffset={setLyricOffset}
                                setLyric={onSongTitleChange}
                            />
                        </Grid>

                    </Grid>
                </Grid>
                <Grid style={{ paddingBottom: 10, overflow: "auto", maxHeight: '80%' }} item xs={12}>
                    <Lrc
                        className={className}
                        style={{ maxHeight: "100%" }}
                        lrc={lyric}
                        autoScroll={true}
                        lineRenderer={lineRenderer}
                        currentMillisecond={+currentTime * 1000 + +lyricOffset} // Add offset value to adapt lrc time
                        //onLineChange={onCurrentLineChange}
                        intervalOfRecoveringAutoScrollAfterUserScroll={
                            INTERVAL_OF_RECOVERING_AUTO_SCROLL_AFTER_USER_SCROLL
                        } />
                </Grid>
            </Grid>

        </React.Fragment >
    )
})
