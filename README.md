# Tremolo Frontend

A communication training application that analyzes presentation videos to provide feedback on body language, vocal delivery, and speech patterns.

## Features

- **Video Upload**: Drag-and-drop or click to upload presentation videos
- **Comprehensive Analysis**: Get scores for overall performance, body language, vocal delivery, and speech
- **Interactive Transcript**: Color-coded highlights that sync with video playback
- **Timeline Visualization**: Visual markers on a timeline showing feedback points
- **Filter Toggles**: Show/hide feedback categories (Body Language, Vocal, Speech)
- **Click-to-Jump**: Click markers or highlighted text to jump to specific moments in the video

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Backend Integration

The frontend expects a backend API at `http://localhost:8000` (or set `VITE_API_BASE_URL` environment variable).

### Environment Setup

Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:8000
```

### API Endpoints

**1. POST** `/api/upload-video`
- **Request**: `multipart/form-data` with `video` field
- **Response**: 
  ```json
  {
    "status": "processing",
    "job_id": "171bd810-9d9e-4f55-87a1-5fabbebb712e"
  }
  ```

**2. GET** `/api/status/{JOB_ID}`
- **Response**: 
  ```json
  {
    "status": "complete",
    "modal_id": "fc-01K9J8Q1ZQ31HFFCPYN0FXMPXW",
    "transcription": {
      "status": "completed",
      "full_text": "Full transcript text...",
      "words": [
        {
          "text": "Hello",
          "start": 0.46,
          "end": 0.64,
          "metrics": {
            "wrist_velocity": 0.0,
            "audio_intensity": 0.1081,
            "pitch": 145.32
          }
        }
      ],
      "error": null
    }
  }
  ```

### How It Works

1. User uploads video → Frontend calls `/api/upload-video`
2. Backend returns `job_id`
3. Frontend polls `/api/status/{job_id}` every 2 seconds
4. When status is "completed", frontend processes the transcription data
5. Frontend automatically:
   - Detects filler words (um, uh, er, etc.)
   - Analyzes pitch variations for monotonous tone
   - Creates feedback markers
   - Calculates scores

### Mock Data

If the backend is not available, the app will automatically use mock data for demonstration purposes.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── VideoPlayer.tsx
│   ├── Transcript.tsx
│   ├── AnalysisDashboard.tsx
│   └── Timeline.tsx
├── pages/           # Page components
│   ├── HomePage.tsx
│   └── AnalysisPage.tsx
├── services/        # API services
│   └── api.ts
├── types/          # TypeScript type definitions
│   └── index.ts
├── mockData.ts     # Mock data for testing
├── App.tsx         # Main app component with routing
└── main.tsx        # Entry point
```

## Color Coding

- **Green**: Body Language feedback
- **Blue**: Vocal feedback
- **Red**: Speech feedback

## Development Notes

- The app uses sessionStorage to pass data between the upload and analysis pages
- Video files are converted to object URLs for playback
- All interactive features (toggles, click-to-jump) are fully functional
- The UI is optimized for desktop use (as per hackathon requirements)

