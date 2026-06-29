# Workspace

**A full stack application designed to give businesses a place to post unused space and connect them with potential renters.**

I developed Workspace as my capstone project for the BrainStation full-stack web development bootcamp. The front-end was developed with React.js and Sass. The back-end used Node.js and Express to build a REST API, JWT for authentication, and Multer for file upload. I also took on the challenge of learning React Hooks for this project.

Please check out my three minute presentation <a href="https://www.loom.com/share/016d401a1d8842ee9ab6083a995d0650">here</a>.

## Tech Stack

- React
- Sass
- Node.js
- Express
- JWT authentication
- Multer file uploads

## Prerequisites

- Node 22 LTS
- npm
- A Google Maps API key

If you use `nvm`, run this from the project root:

```bash
nvm use
```

## Setup

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

Create local environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Then update `client/.env` with your Google Maps API key and update `server/.env` with a JWT secret.

## Running The App

Start the API:

```bash
cd server
npm run dev
```

Start the React app in a second terminal:

```bash
cd client
npm run dev
```

The client runs on `http://localhost:5173`, and the API runs on `http://localhost:8080`.

## Scripts

Client:

```bash
npm run dev
npm start
npm test
npm run typecheck
npm run build
npm run preview
npm run format
```

Server:

```bash
npm start
npm run dev
npm test
npm run format
```

## Modernization Roadmap

- Replace JSON file storage with a database and seed data on startup.
- Add backend route tests and frontend component/hook tests.
- Move data fetching to TanStack Query.
- Extract frontend logic into custom hooks.
- Reduce derived state and unnecessary `useEffect` usage.
