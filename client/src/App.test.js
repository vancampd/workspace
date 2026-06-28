import { render, screen } from '@testing-library/react';
import App from './App';

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
