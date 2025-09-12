# ELD Trip Planner - Trucking Assessment

A full-stack application for Electronic Logging Device (ELD) trip planning with Hours of Service (HOS) compliance for commercial truck drivers.

## Features

- **Route Planning**: Optimized routing using OpenRouteService API for commercial vehicles
- **HOS Compliance**: Automatic calculation of driving limits, break requirements, and duty cycles per FMCSA regulations
- **Daily Log Generation**: FMCSA-compliant PDF logs for each trip
- **Interactive Maps**: Real-time route visualization with Leaflet maps
- **Modern UI**: Material-UI components with responsive design

## Tech Stack

### Backend (Django REST Framework)
- **Django 5.2.6** - Web framework
- **Django REST Framework** - API development
- **OpenRouteService** - Route optimization
- **ReportLab** - PDF generation
- **SQLite** - Database (development)

### Frontend (React + Vite)
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/trip/plan/` - Plan a new trip with HOS compliance
- `GET /api/trip/{id}/` - Get trip details
- `GET /api/trip/{id}/daily-log/` - Download PDF daily log

## HOS Compliance Rules

The system enforces FMCSA Hours of Service regulations:
- **11-hour driving limit** - Maximum 11 hours of driving per day
- **14-hour duty limit** - Maximum 14 hours on duty per day
- **30-minute break** - Required after 8 hours of driving
- **10-hour rest** - Minimum off-duty time between shifts
- **70-hour/8-day cycle** - Maximum 70 hours in 8 consecutive days

## Development

### Running Both Servers
1. Start Django backend: `python manage.py runserver` (port 8000)
2. Start React frontend: `npm run dev` (port 5173)
3. Open http://localhost:5173 in your browser

### Environment Variables

**Backend (.env)**:
```
DEBUG=True
SECRET_KEY=your-secret-key
OPENROUTE_API_KEY=your-api-key
CORS_ALLOW_ALL_ORIGINS=True
```

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:8000/api
```

## Deployment

The application is designed for easy deployment:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Heroku, or DigitalOcean

## Assessment Requirements

✅ **HOS Compliance**: Implements all FMCSA regulations  
✅ **Route Optimization**: Commercial vehicle routing with OpenRouteService  
✅ **FMCSA-compliant Daily Logs**: PDF generation with all required fields  
✅ **Live Hosted Version**: Ready for deployment  
✅ **Modern Tech Stack**: Django REST + React/TypeScript  

## License

This project is for assessment purposes.
