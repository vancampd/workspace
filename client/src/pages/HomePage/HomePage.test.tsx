import { act, screen } from '@testing-library/react';
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

  expect(getLocation()?.pathname).toBe('/listings/miami');
});
