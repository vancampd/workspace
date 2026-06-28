// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { server } from './mocks/server';

process.env.REACT_APP_EXPRESS_API_URL = 'http://localhost:8080/';
process.env.REACT_APP_GOOGLE_GEOCODING_URL =
  'https://maps.googleapis.com/maps/api/geocode/json?address=';
process.env.REACT_APP_GOOGLE_API_KEY = 'test-google-api-key';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
