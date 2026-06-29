# Workspace Client

React client for Workspace.

This project is built with Vite.

## Available Scripts

Run commands from the `client` directory.

### `npm run dev`

Runs the app in development mode.

Open `http://localhost:5173` to view it in the browser.

### `npm test`

Runs the Vitest test suite.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Serves the production build locally.

### `npm run format`

Formats client source files with Prettier.

## Environment

Copy `.env.example` to `.env` and provide a Google Maps API key.

```bash
cp .env.example .env
```

Required variables:

- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_GEOCODING_URL`
- `VITE_EXPRESS_API_URL`
