import videoData from "../data/videos.json";
import fs from "fs";
import path from "path";

import { getWatchedVideos, getMyListVideos } from "./db/hasura";

const CACHE_FILE_PATH = path.join(process.cwd(), "cache.json");
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

// Ensure cache file exists with a valid structure
if (!fs.existsSync(CACHE_FILE_PATH)) {
  fs.writeFileSync(
    CACHE_FILE_PATH,
    JSON.stringify({ data: {}, timestamp: 0 }),
    "utf8"
  );
}

// Read cache
const readCache = () => {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    try {
      const cacheContent = fs.readFileSync(CACHE_FILE_PATH, "utf8");
      const cache = JSON.parse(cacheContent);
      if (Date.now() - cache.timestamp < CACHE_DURATION) {
        return cache.data;
      }
    } catch (error) {
      console.error("Error reading cache file:", error);
      // Return null to fetch fresh data if cache is invalid
      return null;
    }
  }
  return null;
};

// Write to cache
const writeCache = (data) => {
  try {
    fs.writeFileSync(
      CACHE_FILE_PATH,
      JSON.stringify({ data, timestamp: Date.now() }),
      "utf8"
    );
  } catch (error) {
    console.error("Error writing to cache file:", error);
  }
};

export const getCommonVideos = async (url) => {
  const cachedData = readCache(); // Read from cache
  if (cachedData && cachedData[url]) {
    console.log("Returning cached data for:", url);
    return cachedData[url]; // Return cached response if available
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const BASE_URL = "youtube.googleapis.com/youtube/v3";

    const response = await fetch(
      `https://${BASE_URL}/${url}&maxResults=15&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data?.error) {
      console.error("YouTube API error:", data.error);
      return [];
    }

    const videos = data?.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        title: snippet.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });

    // Update cache
    const currentCache = readCache() || {};
    currentCache[url] = videos;
    writeCache(currentCache);

    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&type=video&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};
