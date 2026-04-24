---
inclusion: manual
---

# Research and Analysis

## Video Research Workflow

### Find and Summarize a Topic

1. Search for relevant videos:
   ```
   videos_searchVideos with query="kubernetes best practices 2025", maxResults=5
   ```
2. Get details on the most relevant result:
   ```
   videos_getVideo with videoId="video-id-here", parts=["snippet", "statistics"]
   ```
3. Pull the transcript:
   ```
   transcripts_getTranscript with videoId="video-id-here"
   ```
4. Use the transcript content for summarization or analysis.

### Compare Multiple Videos on a Topic

1. Search for the topic:
   ```
   videos_searchVideos with query="React vs Vue 2025", maxResults=10
   ```
2. Get transcripts from the top results:
   ```
   transcripts_getTranscript with videoId="first-video-id"
   transcripts_getTranscript with videoId="second-video-id"
   ```
3. Compare the content, arguments, and recommendations across videos.

## Channel Exploration

### Audit a Channel's Content

1. Get channel info:
   ```
   channels_getChannel with channelId="UCxxxxxxxxxxxxxxxxxxxxxx"
   ```
2. List recent videos:
   ```
   channels_listVideos with channelId="UCxxxxxxxxxxxxxxxxxxxxxx", maxResults=20
   ```
3. Get details on specific videos of interest:
   ```
   videos_getVideo with videoId="video-id", parts=["snippet", "statistics", "contentDetails"]
   ```

### Find a Channel's Most Popular Content

1. List videos from the channel:
   ```
   channels_listVideos with channelId="UCxxxxxxxxxxxxxxxxxxxxxx", maxResults=50
   ```
2. Get statistics for each video to sort by view count:
   ```
   videos_getVideo with videoId="video-id", parts=["statistics"]
   ```

## Playlist Analysis

### Extract All Content from a Playlist

1. Get playlist details:
   ```
   playlists_getPlaylist with playlistId="PLxxxxxxxxxxxxxxxxxxxxxx"
   ```
2. List all items:
   ```
   playlists_getPlaylistItems with playlistId="PLxxxxxxxxxxxxxxxxxxxxxx", maxResults=50
   ```
3. Pull transcripts from each video for a complete content dump:
   ```
   transcripts_getTranscript with videoId="video-id-from-playlist"
   ```

### Course or Tutorial Series Analysis

1. Get the playlist items:
   ```
   playlists_getPlaylistItems with playlistId="PLxxxxxxxxxxxxxxxxxxxxxx", maxResults=50
   ```
2. Get video details for duration info:
   ```
   videos_getVideo with videoId="video-id", parts=["contentDetails", "snippet"]
   ```
3. Pull transcripts to create study notes or a table of contents:
   ```
   transcripts_getTranscript with videoId="video-id"
   ```

## Transcript Workflows

### Generate Meeting Notes from a Recorded Session

1. Get the transcript:
   ```
   transcripts_getTranscript with videoId="meeting-video-id"
   ```
2. Use the transcript to extract action items, decisions, and key discussion points.

### Create Documentation from a Tutorial Video

1. Pull the transcript:
   ```
   transcripts_getTranscript with videoId="tutorial-video-id"
   ```
2. Use the transcript to create step-by-step written documentation with code examples.

### Multi-Language Content

If a video has transcripts in multiple languages:
```
transcripts_getTranscript with videoId="video-id", language="es"
```

Common language codes: `en` (English), `es` (Spanish), `fr` (French), `de` (German), `ja` (Japanese), `ko` (Korean), `pt` (Portuguese), `zh` (Chinese).

## Finding IDs

### Video ID
From a YouTube URL like `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the video ID is `dQw4w9WgXcQ` (the value after `v=`).

### Channel ID
From a channel URL like `https://www.youtube.com/@channelname`, you may need to use the page source or API to find the channel ID (starts with `UC`). Alternatively, search for the channel name and extract the ID from results.

### Playlist ID
From a playlist URL like `https://www.youtube.com/playlist?list=PLxxxxxx`, the playlist ID is the value after `list=` (starts with `PL`).
