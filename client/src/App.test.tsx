import { render, screen } from '@testing-library/react';
import App from './App';

test('renders an app route', () => {
  window.history.pushState({}, 'Login', '/login');

  render(<App />);

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
});
