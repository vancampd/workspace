import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import Login from './Login';

const renderLogin = () => {
  const props = {
    setShowRegister: vi.fn(),
    setShowLogin: vi.fn(),
    setSignedIn: vi.fn(),
    setCredentials: vi.fn(),
  };

  renderWithProviders(<Login {...props} />);

  return props;
};

test('logs in with mocked credentials and updates auth state', async () => {
  const user = userEvent.setup();
  const props = renderLogin();

  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/password/i), 'password');
  await user.click(screen.getByRole('button', { name: /login/i }));

  await screen.findByText(/if you do not have a username/i);

  expect(localStorage.getItem('token')).toBeTruthy();
  expect(localStorage.getItem('name')).toBe('Test User');
  expect(props.setShowLogin).toHaveBeenCalledWith(false);
  expect(props.setSignedIn).toHaveBeenCalledWith(true);
  expect(props.setCredentials).toHaveBeenCalledWith({ name: 'Test User' });
});
