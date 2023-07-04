/**
 * refactor:
 * bilisearch workflow:
 * reExtractSearch matches regex patterns and use the corresponding fetch functions;
 * fetch function takes extracted and calls a dataProcess.js fetch function;
 * dataprocess fetch function fetches VIDEOINFO using data.js fetch function, then parses into SONGS
 * data.js fetch function fetches VIDEOINFO.
 * steps to refactor:
 * each site needs a fetch to parse regex extracted, a videoinfo fetcher and a song fetcher.
 */
import { regexFetchProps } from './generic';
import { biliApiLimiter } from './throttle';

import { BiliShazamOnSonglist } from '../../background/DataProcess';
import VideoInfo from '../../objects/VideoInfo';
import SongTS from '../../objects/SongTS';
import logger from '../Logger';

const URL_VIDEO_INFO =
  'https://api.bilibili.com/x/web-interface/view?aid={aid}';

const fetchVideoInfoRaw = async (aid: string) => {
  logger.info(
    `calling fetchVideoInfo of ${aid} of ${URL_VIDEO_INFO.replace(
      '{aid}',
      aid,
    )}`,
  );
  try {
    const res = await fetch(URL_VIDEO_INFO.replace('{aid}', aid));
    const json = await res.json();
    const { data } = json;
    const v = new VideoInfo(
      data.title,
      data.desc,
      data.videos,
      data.pic,
      data.owner,
      data.pages.map((s: any) => {
        return {
          bvid: data.bvid,
          part: s.part,
          cid: s.cid,
          duration: s.duration,
        };
      }),
      data.bvid,
      data.duration,
    );
    return v;
  } catch (error: any) {
    logger.error(error.message);
    logger.warn(`Some issue happened when fetching ${aid}`);
    // throw error;
  }
};

export const fetchVideoInfo = async (
  bvid: string,
  progressEmitter: () => void = () => undefined,
) =>
  await biliApiLimiter.schedule(() => {
    progressEmitter();
    return fetchVideoInfoRaw(bvid);
  });

export const fetchiliBVIDs = async (
  BVids: string[],
  progressEmitter: (val: number) => void = () => undefined,
) => {
  const BVidLen = BVids.length;
  const BVidPromises = BVids.map((bvid, index) =>
    fetchVideoInfo(bvid, () => progressEmitter((100 * (index + 1)) / BVidLen)),
  );
  const resolvedBVIDs = await Promise.all(BVidPromises);
  return resolvedBVIDs.filter((val) => val) as VideoInfo[];
};

export const songFetch = async ({
  videoinfos,
  useBiliTag,
}: {
  videoinfos: VideoInfo[];
  useBiliTag: boolean;
}) => {
  const aggregateVideoInfo = (info: VideoInfo) =>
    info.pages.map((page: any, index: number) => {
      const filename = info.pages.length === 1 ? info.title : page.part;
      return SongTS({
        cid: page.cid,
        bvid: info.bvid,
        name: filename,
        nameRaw: filename,
        singer: info.uploader.name,
        singerId: info.uploader.mid,
        cover: info.picSrc,
        lyric: '',
        page: index + 1,
        duration: page.duration,
        album: info.title,
      });
    });
  let songs = videoinfos.reduce(
    (acc, curr) => acc.concat(aggregateVideoInfo(curr)),
    [],
  ) as NoxMedia.Song[];
  if (useBiliTag) songs = await BiliShazamOnSonglist(songs);
  return songs;
};

const regexFetch = async ({ reExtracted, useBiliTag }: regexFetchProps) => {
  return songFetch({
    videoinfos: await fetchiliBVIDs([reExtracted[1]!]), // await fetchiliBVID([reExtracted[1]!])
    useBiliTag: useBiliTag || false,
  });
};

const resolveURL = () => undefined;

const refreshSong = (song: NoxMedia.Song) => song;

export default {
  regexSearchMatch: /(av[^/?]+)/,
  regexFetch,
  regexResolveURLMatch: /^null-/,
  resolveURL,
  refreshSong,
};