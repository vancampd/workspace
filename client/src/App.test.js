import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import App from './App';
import { mockListings } from './mocks/fixtures/listings';
import { server } from './mocks/server';

test('renders an app route', () => {
  window.history.pushState({}, 'Login', '/login');

  render(<App />);

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
});

test('renders listings from the mocked API', async () => {
  window.history.pushState({}, 'Listings', '/listings/miami');

  render(<App />);

  expect(
    await screen.findByText(/work space office and conference room/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/mignonette - repurposing our space/i)
  ).toBeInTheDocument();
});

test('searches by city and renders matching listings', async () => {
  window.history.pushState({}, 'Home', '/home');
  let resolveListingsRequest;
  const listingsRequest = new Promise((resolve) => {
    resolveListingsRequest = resolve;
  });

  server.use(
    rest.get('http://localhost:8080/listings', (req, res, ctx) => {
      resolveListingsRequest();
      return res(ctx.status(200), ctx.json(mockListings));
    })
  );

  render(<App />);
  await act(async () => {
    await listingsRequest;
  });

  userEvent.type(screen.getByLabelText(/location/i), 'Miami');
  userEvent.click(screen.getByRole('button', { name: /search/i }));

  expect(
    await screen.findByText(/work space office and conference room/i)
  ).toBeInTheDocument();
  expect(window.location.pathname).toBe('/listings/miami');
});

test('logs in with mocked credentials and shows signed-in navigation', async () => {
  window.history.pushState({}, 'Home', '/home');

  render(<App />);

  userEvent.click(screen.getByText(/sign in/i));
  userEvent.type(screen.getByLabelText(/username/i), 'test');
  userEvent.type(screen.getByLabelText(/password/i), 'password');
  userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/favorites/i)).toBeInTheDocument();
  expect(screen.getByText(/post your space/i)).toBeInTheDocument();
  expect(screen.getByText(/logout/i)).toBeInTheDocument();
});
