# Workspace

A full-stack marketplace application designed to help businesses list unused office space and connect with potential renters.

Originally developed as my capstone project for the BrainStation full-stack web development bootcamp, Workspace gave me the opportunity to build an application end-to-end, including frontend development, REST APIs, authentication, file uploads, and third-party integrations.

I've since revisited the project to modernize its frontend architecture and apply engineering practices I've developed through several years of professional experience.

**[Watch the original three-minute project presentation](https://www.loom.com/share/016d401a1d8842ee9ab6083a995d0650)**

## Features

- Browse available workspace listings
- Create workspace listings and upload images
- Register and log in with JWT-based authentication
- Save favorite listings
- View and submit comments and ratings
- Explore locations using Google Maps and geocoding

## Tech Stack

### Frontend

- React 19 and TypeScript
- Vite
- TanStack Query
- React Router
- Axios
- React Hook Form
- Sass

### Backend

- Node.js and Express
- REST APIs
- JWT and bcrypt
- Multer for file uploads
- JSON file-based persistence

### Testing & Tooling

- Vitest
- React Testing Library
- Mock Service Worker (MSW)
- Jest and Supertest
- ESLint and Prettier

## Frontend Modernization

After several years of professional engineering experience, I returned to Workspace to evaluate and improve the original implementation.

The modernization has focused on updating the frontend stack, simplifying state management, improving separation of concerns, and introducing automated testing.

### Completed Improvements

**1. Modernized the development stack**

- Migrated from Create React App to Vite
- Migrated the frontend from JavaScript to TypeScript
- Upgraded React to version 19
- Updated routing and supporting frontend dependencies

**2. Introduced TanStack Query**

- Centralized HTTP requests in a dedicated API layer
- Migrated data fetching to reusable query hooks
- Migrated create, update, and delete operations to mutation hooks
- Added shared QueryClient configuration and testing support

This separates server-state management from local UI state and provides a more consistent approach to asynchronous requests.

**3. Simplified React state management**

- Extracted repeated logic into custom hooks
- Removed unnecessary `useEffect` usage
- Replaced effects that synchronized derived values with simpler state initialization and calculations
- Reduced duplicated state between API responses and components

**4. Improved automated testing**

- Migrated frontend testing to Vitest
- Added React Testing Library and MSW
- Created shared request mocks and provider-aware rendering utilities
- Added tests for key pages and application workflows
- Added form tests covering validation, request payloads, and recovery from failed requests

**5. Migrated forms to React Hook Form**

- Replaced hand-rolled form state and validation with React Hook Form
- Validated multi-step listing uploads one step at a time while preserving entered values
- Displayed request errors from mutation state so failed submissions can be retried
- Disabled submit buttons while requests are in flight to prevent duplicate submissions

The modernization also included successful test, TypeScript, and production-build checks, as documented in the project TODO.

## Architecture

Workspace uses a React frontend communicating with a Node.js/Express REST API.

The frontend uses TanStack Query hooks to coordinate API requests and manage server state, React Hook Form manages form state and validation, and local React state handles other UI interactions.

The backend provides endpoints for authentication, listings, comments, favorites, image uploads, and geocoding.

The original implementation uses JSON files for persistence. Replacing this with a relational database remains a planned improvement.

## Getting Started

### Prerequisites

- Node.js 22
- npm
- Google Maps API credentials

### Installation

Clone the repository:

```bash
git clone https://github.com/vancampd/workspace.git
cd workspace
```

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install

cd ..
```

### Environment Configuration

From the repository root:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Configure the environment variables using the example files as a reference.

Two separate Google keys are used:

- `server/.env` `GOOGLE_API_KEY`: used by the backend `/geocode` route. Keep it private and restrict it to the Geocoding API (and by IP in production).
- `client/.env` `VITE_GOOGLE_MAPS_API_KEY`: loaded by the browser for the Maps JavaScript API, so it is public by design. Restrict it in Google Cloud to the Maps JavaScript API and your HTTP referrers (`localhost:*` and your production domain).

Do not commit real credentials or API keys.

### Running Locally

Start the backend:

```bash
cd server
npm run dev
```

In a second terminal, start the frontend:

```bash
cd client
npm run dev
```

By default:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

### Verification

From the `client` directory:

```bash
npm test
npm run typecheck
npm run build
npm run lint
```

## Remaining Improvements

The following work remains on the modernization roadmap.

### Backend and Security

- Replace JSON file storage with a relational database
- Add database-backed integration tests
- Enforce JWT verification and resource-level authorization
- Strengthen request validation and upload security
- Add rate limiting for sensitive endpoints

### TypeScript and Architecture

- Enable stricter TypeScript compiler settings
- Add stronger domain types for API payloads and application entities
- Further separate larger page components into focused hooks and components
- Add schema-based form validation and split the multi-step upload form into smaller components

### Testing and Delivery

- Expand test coverage for login request payloads, image upload payloads, and login/sign-up modal switching
- Improve accessibility for forms and interactive controls
- Add CI checks for automated tests, type checking, and builds
- Evaluate route-level lazy loading

The detailed task history and additional ideas are maintained in [TODO.md](./TODO.md).

## Project Context

Workspace began as a bootcamp capstone before I entered the software engineering profession.

The original implementation reflects the skills and decisions I was making at that point in my career. The subsequent frontend modernization reflects the practices I've developed while building and maintaining production applications professionally.

The project remains educational rather than production-ready. In particular, server-side authorization, file upload security, and persistence require further work before it should be deployed with real user data.

## About Me

I'm a full-stack software engineer with 5+ years of professional experience working with React, TypeScript, Node.js, MySQL, and AWS.

My recent work includes owning customer-facing applications, designing asynchronous backend workflows, integrating third-party services, and leading engineering efforts across production systems.

**[LinkedIn](https://www.linkedin.com/in/daniel-van-camp/)**
