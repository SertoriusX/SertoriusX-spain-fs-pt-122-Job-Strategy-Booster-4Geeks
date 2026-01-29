# AI Copilot Instructions

## Project Overview
Job Strategy Booster is a React + Flask full-stack application designed for job seekers to track postulations and manage their job search journey. It integrates OpenAI for interview prep and Google Translate API for multi-language support.

**Tech Stack:** React 18 + Vite (frontend), Flask with SQLAlchemy (backend), PostgreSQL/SQLite (database)

## Architecture

### Backend Structure (`src/api/`)
- **routes.py**: Single large file containing all API endpoints; imports models and utilities
- **models.py**: SQLAlchemy ORM models (User, Postulations, Profile, Stages, CV)
- **commands.py**: Flask CLI commands for data seeding (e.g., `flask insert-test-users 5`)
- **admin.py**: Flask-Admin setup for database management
- **utils.py**: Custom APIException class and sitemap generator

### Frontend Structure (`src/front/`)
- **routes.jsx**: React Router configuration; all route definitions centralized here
- **store.js**: Global state management via useContext + useReducer pattern
- **hooks/**: Custom hooks including UserContextProvider for auth state
- **pages/**: Routable components (HomePage, Jobs, Curriculum, Interview, etc.)
- **components/**: Reusable UI components organized by feature (JobComponent/, ProfileComponents/, navbar/)
- **Fetch/**: API client functions (postulationFetch.js, routeMapFetch.js)
- **styles/**: CSS modules, primarily class-based styling

## Key Development Workflows

### Backend Setup
```bash
pipenv install           # Install Python dependencies
cp .env.example .env     # Create environment file (requires DATABASE_URL, JWT_SECRET_KEY)
pipenv run migrate       # Create migration from model changes
pipenv run upgrade       # Apply migrations to database
pipenv run start         # Run Flask server on port 3001
pipenv run insert-test-users 5  # Seed test data
```

### Frontend Setup
```bash
npm install              # Install Node dependencies (requires Node 20+)
npm run start           # Start Vite dev server (frontend-only)
npm run build           # Build for production (generates dist/)
```

### Running Both Services
- Backend runs on http://localhost:3001
- Frontend Vite dev server typically runs on http://localhost:5173
- CORS enabled on backend to allow cross-origin requests

## Project-Specific Conventions

### API Response Handling
- Errors use custom `APIException` class with `to_dict()` method
- Endpoints return JSON with consistent error structure: `{"message": "...", ...}`
- Authentication uses Flask-JWT-Extended; protected routes use `@jwt_required()` decorator

### Data Models
- User is central entity with relationships: Profile (1-to-1), Postulations (1-to-many), CV (1-to-many)
- Postulations tracks job applications with stages (Postulations → Stages relationship)
- All models have `serialize()` method for consistent API responses
- Timestamps (fecha_creacion, fecha_modificacion) use SQLAlchemy defaults

### Frontend State Management
- Global state via `useGlobalReducer()` hook wrapping React Context
- Reducer pattern in store.js: `case 'action_type': return { ...store, updated_field }`
- Auth state stored in UserContextProvider; check `usePageTranslate.js` for multi-language pattern

### Common Integration Points
- OpenAI API (routes.py): GPT for interview questions and CV analysis
- Google Translate API: Multi-language support via `/api/translate` endpoint
- File uploads: Tesseract OCR integration for CV parsing from images

## Database Notes
- Supports SQLite (default: test.db), PostgreSQL, MySQL via DATABASE_URL config
- SQLAlchemy with modern type hints (Mapped, mapped_column)
- Each environment (Codespaces, local) has isolated database
- Seeding via commands.py prevents manual test data entry

## Important Gotchas
- **API keys in routes.py**: Multiple hardcoded OpenAI keys visible (SECURITY: should move to .env)
- **Pipenv scripts**: Commands use `pipenv run` prefix (e.g., `pipenv run start`, not `python -m flask run`)
- **Frontend build output**: Production output goes to `dist/` directory; Vite handles bundling
- **JWT authentication**: Backend expects `Authorization: Bearer <token>` header from frontend
