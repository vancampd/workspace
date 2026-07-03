import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import ListingsPage from './ListingsPage';

const credentials = { name: 'Test User' };

const renderListingsPage = ({
  path = '/listings/miami',
  route = '/listings/:city',
  signedIn = false,
} = {}) =>
  renderWithProviders(
    <ListingsPage signedIn={signedIn} credentials={credentials} />,
    {
      route: path,
      path: route,
    }
  );

test('renders listings from the mocked API', async () => {
  renderListingsPage();

  expect(
    await screen.findByText(/work space office and conference room/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/mignonette - repurposing our space/i)
  ).toBeInTheDocument();
});

test('blocks favorites page for signed-out users', () => {
  renderListingsPage({
    path: '/favorites',
    route: '/favorites',
  });

  expect(
    screen.getByText(/you must be logged in to view your favorites/i)
  ).toBeInTheDocument();
});

test('renders an empty favorites state for a signed-in user', async () => {
  renderListingsPage({
    path: '/favorites',
    route: '/favorites',
    signedIn: true,
  });

  expect(
    await screen.findByText(/you don't have any favorites/i)
  ).toBeInTheDocument();
});
