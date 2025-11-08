# How Transcription Works in Tremolo

## Overview

The transcription process happens on the **backend**, not in the frontend. Here's how it works:

## Backend Process

1. **Video Upload**: When you upload a video file, it's sent to the backend API endpoint (`POST /analyze`)

2. **Audio Extraction**: The backend extracts the audio track from the video file

3. **Speech-to-Text**: The backend uses a speech recognition service (like:
   - **OpenAI Whisper** (popular, accurate, open-source)
   - **Google Cloud Speech-to-Text**
   - **AWS Transcribe**
   - **Azure Speech Services**
   - Or other transcription APIs)

4. **Text Processing**: The backend processes the transcript to:
   - Clean up the text
   - Generate word-level timestamps (if available)
   - Identify filler words, pauses, etc.

5. **Analysis**: The backend analyzes the transcript along with the video to:
   - Detect filler words ("um", "uh", "like", etc.)
   - Analyze vocal patterns (tone, pace, volume)
   - Analyze body language (if video analysis is included)
   - Generate feedback markers with timestamps

6. **Response**: The backend returns a JSON object containing:
   - The full transcript (as a string)
   - Analysis scores
   - Feedback markers with timestamps and transcript positions

## Frontend Role

The frontend **does NOT** do transcription. It:
- Displays the transcript received from the backend
- Makes words clickable to jump to estimated timestamps
- Highlights feedback markers in the transcript
- Syncs the transcript with video playback

## Timestamp Estimation

Since the backend provides markers with timestamps, the frontend can:
- Use marker timestamps as anchor points
- Interpolate between markers to estimate timestamps for other words
- Provide click-to-jump functionality for every word

## Improving Accuracy

For better word-level timestamp accuracy, your backend could:
1. Use transcription services that provide word-level timestamps (like Whisper with timestamps)
2. Return word-level data in the API response:
   ```json
   {
     "transcript": "Hello everyone...",
     "words": [
       { "word": "Hello", "start": 0.0, "end": 0.5 },
       { "word": "everyone", "start": 0.5, "end": 1.2 },
       ...
     ]
   }
   ```
3. This would allow the frontend to use exact timestamps instead of estimates

## Current Implementation

Right now, the frontend:
- Uses marker timestamps as anchor points
- Estimates timestamps for other words by interpolating between markers
- Makes every word clickable with estimated timestamps
- Highlights words that have feedback markers with exact timestamps

