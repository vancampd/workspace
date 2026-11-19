import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockListings } from '../../mocks/fixtures/listings';
import { mockGetRequest } from '../../mocks/mockRequests';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import HomePage from './HomePage';

test('searches by city and routes to matching listings', async () => {
  const user = userEvent.setup();
  let resolveListingsRequest: () => void;
  const listingsRequest = new Promise<void>((resolve) => {
    resolveListingsRequest = resolve;
  });

  mockGetRequest('listings', mockListings, 200, () => resolveListingsRequest());

  const { getLocation } = renderWithProviders(<HomePage />, { route: '/home' });
  await act(async () => {
    await listingsRequest;
  });

  await user.type(screen.getByLabelText(/location/i), 'Miami');
  await user.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => expect(getLocation()?.pathname).toBe('/listings/miami'));
});

test('validates missing search location', async () => {
  const user = userEvent.setup();
  renderWithProviders(<HomePage />, { route: '/home' });

  await user.click(screen.getByRole('button', { name: /search/i }));

  expect(screen.getByText(/you must enter a location/i)).toBeInTheDocument();
});

test('validates search location with no listings', async () => {
  const user = userEvent.setup();

  mockGetRequest('listings', mockListings);
  renderWithProviders(<HomePage />, { route: '/home' });

  await user.type(screen.getByLabelText(/location/i), 'Tampa');
  await user.click(screen.getByRole('button', { name: /search/i }));

  expect(
    await screen.findByText(/sorry, there are no listings currently in that city/i)
  ).toBeInTheDocument();
});

test('disables search while listings are loading', async () => {
  let resolveListingsRequest!: () => void;
  const listingsRequest = new Promise<void>((resolve) => {
    resolveListingsRequest = resolve;
  });

  mockGetRequest('listings', mockListings, 200, () => listingsRequest);
  renderWithProviders(<HomePage />, { route: '/home' });

  const searchButton = screen.getByRole('button', { name: /search/i });
  expect(searchButton).toBeDisabled();
  expect(screen.queryByText(/there are no listings/i)).not.toBeInTheDocument();

  resolveListingsRequest();
  await waitFor(() => expect(searchButton).toBeEnabled());
});

test('shows a listings request error and keeps search disabled', async () => {
  mockGetRequest('listings', { message: 'Unable to load listings' }, 500);
  renderWithProviders(<HomePage />, { route: '/home' });

  expect(
    await screen.findByText(/unable to load listings. please try again./i)
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
});

test('ignores surrounding whitespace in the searched city', async () => {
  const user = userEvent.setup();

  mockGetRequest('listings', mockListings);
  const { getLocation } = renderWithProviders(<HomePage />, { route: '/home' });

  const searchButton = screen.getByRole('button', { name: /search/i });
  await waitFor(() => expect(searchButton).toBeEnabled());

  await user.type(screen.getByLabelText(/location/i), '  Miami ');
  await user.click(searchButton);

  await waitFor(() => expect(getLocation()?.pathname).toBe('/listings/miami'));
});

test('treats a whitespace-only location as missing', async () => {
  const user = userEvent.setup();

  mockGetRequest('listings', mockListings);
  renderWithProviders(<HomePage />, { route: '/home' });

  const searchButton = screen.getByRole('button', { name: /search/i });
  await waitFor(() => expect(searchButton).toBeEnabled());

  await user.type(screen.getByLabelText(/location/i), '   ');
  await user.click(searchButton);

  expect(await screen.findByText(/you must enter a location/i)).toBeInTheDocument();
  expect(screen.queryByText(/there are no listings/i)).not.toBeInTheDocument();
});
