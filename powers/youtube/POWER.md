---
name: "youtube"
displayName: "YouTube"
description: "YouTube platform operations via MCP. Search videos, get video details, read transcripts, explore channels, and browse playlists from your AI assistant."
keywords: ["youtube", "video", "transcript", "channel", "playlist"]
author: "Kiro Community"
---

# YouTube

## Overview

YouTube MCP provides access to the YouTube Data API through the Model Context Protocol. It covers video search, video details, transcripts, channel information, and playlist management.

This power enables your AI assistant to search for videos, pull transcripts for analysis or summarization, explore channel content, and browse playlists — all without leaving your editor.

## Available Steering Files

- **research-and-analysis** — Video research workflows, transcript analysis, channel exploration, and content comparison patterns

## Onboarding

### Prerequisites
- A Google account
- A YouTube Data API v3 key
- Node.js 18+ (for npx)

### Getting Your YouTube API Key

1. Go to https://console.cloud.google.com/
2. Create a new project (or select an existing one)
3. Navigate to "APIs & Services" → "Library"
4. Search for "YouTube Data API v3" and enable it
5. Go to "APIs & Services" → "Credentials"
6. Click "Create Credentials" → "API key"
7. Copy the generated API key

### Configuration

After installing this power, replace `YOUR_YOUTUBE_API_KEY_HERE` in `mcp.json` with your actual API key.

## Common Workflows

### Search for Videos

```
videos_searchVideos with query="TypeScript tutorial 2025"
```

Limit results:
```
videos_searchVideos with query="React server components", maxResults=5
```

### Get Video Details

```
videos_getVideo with videoId="dQw4w9WgXcQ"
```

With specific parts:
```
videos_getVideo with videoId="dQw4w9WgXcQ", parts=["snippet", "statistics", "contentDetails"]
```

### Get a Video Transcript

```
transcripts_getTranscript with videoId="dQw4w9WgXcQ"
```

Specific language:
```
transcripts_getTranscript with videoId="dQw4w9WgXcQ", language="en"
```

### Get Channel Information

```
channels_getChannel with channelId="UCxxxxxxxxxxxxxxxxxxxxxx"
```

### List Videos from a Channel

```
channels_listVideos with channelId="UCxxxxxxxxxxxxxxxxxxxxxx"
```

Limit results:
```
channels_listVideos with channelId="UCxxxxxxxxxxxxxxxxxxxxxx", maxResults=10
```

### Get Playlist Details

```
playlists_getPlaylist with playlistId="PLxxxxxxxxxxxxxxxxxxxxxx"
```

### List Videos in a Playlist

```
playlists_getPlaylistItems with playlistId="PLxxxxxxxxxxxxxxxxxxxxxx"
```

Limit results:
```
playlists_getPlaylistItems with playlistId="PLxxxxxxxxxxxxxxxxxxxxxx", maxResults=20
```

## Troubleshooting

### "API key not valid" or 403 errors
**Cause:** API key is invalid, expired, or YouTube Data API v3 is not enabled.
**Solution:**
1. Verify your API key at https://console.cloud.google.com/apis/credentials
2. Ensure "YouTube Data API v3" is enabled under APIs & Services → Library
3. Check the key hasn't been restricted to other APIs only

### "Video not found" or 404 errors
**Cause:** The video ID is incorrect, or the video is private/deleted.
**Solution:**
1. Verify the video ID (the part after `v=` in a YouTube URL)
2. Check the video is publicly accessible
3. Private and unlisted videos may not be accessible via API

### Transcript not available
**Cause:** Not all videos have transcripts. Auto-generated captions may also be unavailable.
**Solution:**
1. Check if the video has captions enabled (CC icon on YouTube)
2. Try a different language code
3. Some videos disable caption access via API

### Quota exceeded (429 errors)
**Cause:** YouTube Data API has a daily quota (default 10,000 units).
**Solution:**
1. Wait until the quota resets (midnight Pacific Time)
2. Reduce the number of API calls
3. Request a quota increase in Google Cloud Console if needed

### Empty search results
**Cause:** Query too specific or content not indexed yet.
**Solution:**
1. Broaden the search query
2. Remove special characters
3. Try alternative keywords

## Best Practices

- Use `videos_searchVideos` to find video IDs before calling other tools
- Pull transcripts for summarization, translation, or content analysis
- Use `maxResults` to limit API calls and conserve quota
- Channel IDs can be found in the channel URL (starts with `UC`)
- Playlist IDs can be found in playlist URLs (starts with `PL`)
- Combine search + transcript for research workflows: find relevant videos, then extract their content

## MCP Config Placeholders

**`YOUR_YOUTUBE_API_KEY_HERE`**: Your YouTube Data API v3 key.
- **How to get it:**
  1. Go to https://console.cloud.google.com/
  2. Create or select a project
  3. Enable "YouTube Data API v3" under APIs & Services → Library
  4. Go to APIs & Services → Credentials
  5. Click "Create Credentials" → "API key"
  6. Copy the key and paste it as the value

---

**Package:** `@sfiorini/youtube-mcp`
**MCP Server:** youtube
