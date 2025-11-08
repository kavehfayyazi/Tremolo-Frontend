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

### API Endpoint

**POST** `/analyze`
- **Request**: `multipart/form-data` with `video` field
- **Response**: JSON object with:
  ```json
  {
    "overallScore": 8.5,
    "bodyLanguageScore": 9.0,
    "vocalScore": 8.0,
    "speechScore": 8.5,
    "transcript": "Full transcript text...",
    "markers": [
      {
        "category": "speech",
        "timestamp": 12.5,
        "feedback": "Filler word 'um' detected",
        "transcriptStartIndex": 67,
        "transcriptEndIndex": 69
      }
    ]
  }
  ```

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

