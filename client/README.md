# Workspace Client

React client for Workspace.

This project was bootstrapped with Create React App.

## Available Scripts

Run commands from the `client` directory.

### `npm start`

Runs the app in development mode.

Open `http://localhost:3000` to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run format`

Formats client source files with Prettier.

## Environment

Copy `.env.example` to `.env` and provide a Google Maps API key.

```bash
cp .env.example .env
```

Required variables:

- `REACT_APP_GOOGLE_API_KEY`
- `REACT_APP_GOOGLE_GEOCODING_URL`
- `REACT_APP_EXPRESS_API_URL`
