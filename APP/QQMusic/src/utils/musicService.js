import axios from 'axios'

// NetEase API (Existing)
const NETEASE_API_BASE_URL = 'https://netease-cloud-music-api-teal-psi.vercel.app'
const NETEASE_FALLBACK_API = 'https://api.janyin.top/netease'

// QQ Music API (jsososo/QQMusicApi public mirror)
const QQ_API_BASE_URL = 'https://api.jsososo.com' // Common public mirror for jsososo/QQMusicApi

export const musicService = {
  // Search songs (supports both platforms)
  searchSongs: async (keywords, platform = 'qq') => {
    try {
      if (platform === 'qq') {
        const response = await axios.get(`${QQ_API_BASE_URL}/search?key=${keywords}`)
        return response.data.data.list.map(song => ({
          id: song.songmid,
          title: song.songname,
          artist: song.singer.map(s => s.name).join('/'),
          album: song.albumname,
          cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg`,
          platform: 'qq'
        }))
      } else {
        const response = await axios.get(`${NETEASE_API_BASE_URL}/search?keywords=${keywords}`)
        return response.data.result.songs.map(song => ({
          id: song.id,
          title: song.name,
          artist: song.artists.map(a => a.name).join('/'),
          platform: 'netease'
        }))
      }
    } catch (error) {
      console.error('Error searching songs:', error)
      return []
    }
  },

  // Get song URL
  getSongUrl: async (id, platform = 'qq') => {
    try {
      if (platform === 'qq' || isNaN(id)) {
        // QQ Music logic from jsososo/QQMusicApi
        // Note: some mirrors use 'song/url', some use 'url'
        const response = await axios.get(`${QQ_API_BASE_URL}/song/url?id=${id}&type=320`)
        if (response.data && response.data.data) {
          // The API might return a direct string or an object with url
          const url = typeof response.data.data === 'string' ? response.data.data : response.data.data
          return url ? url.replace('http://', 'https://') : null
        }
      }

      // Fallback to NetEase if it's a numeric ID or QQ failed
      const METING_API = `https://api.i-meto.com/meting/api?server=netease&type=url&id=${id}`
      try {
        const metingRes = await axios.get(METING_API)
        if (metingRes.data && metingRes.data.url) {
          return metingRes.data.url.replace('http://', 'https://')
        }
      } catch (e) {}

      const nRes = await axios.get(`${NETEASE_API_BASE_URL}/song/url?id=${id}`)
      return nRes.data.data[0].url ? nRes.data.data[0].url.replace('http://', 'https://') : null
    } catch (error) {
      console.error('Error getting song URL:', error)
      // Final fallback pattern
      return platform === 'netease' ? `https://music.163.com/song/media/outer/url?id=${id}.mp3` : null
    }
  },

  // Get lyrics
  getLyrics: async (id, platform = 'qq') => {
    try {
      if (platform === 'qq' || isNaN(id)) {
        const response = await axios.get(`${QQ_API_BASE_URL}/lyric?songmid=${id}`)
        return response.data.data.lyric || '[00:00.00] 暂无歌词'
      }
      const response = await axios.get(`${NETEASE_API_BASE_URL}/lyric?id=${id}`)
      return response.data.lrc.lyric
    } catch (error) {
      console.error('Error getting lyrics:', error)
      return '[00:00.00] 暂无歌词'
    }
  }
}
