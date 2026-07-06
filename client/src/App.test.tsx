import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils/renderWithProviders';
import App from './App';

test('renders an app route', () => {
  window.history.pushState({}, 'Login', '/login');

  renderWithProviders(<App />, { withRouter: false });

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
});
