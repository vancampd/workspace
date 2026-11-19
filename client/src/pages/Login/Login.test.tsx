import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { mockPostRequest } from '../../mocks/mockRequests';
import { server } from '../../mocks/server';
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

test('validates required login fields', async () => {
  const user = userEvent.setup();
  renderLogin();

  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByText(/you must enter a username/i)).toBeInTheDocument();
  expect(screen.getByText(/you must enter a password/i)).toBeInTheDocument();
});

test('logs in with mocked credentials and updates auth state', async () => {
  const user = userEvent.setup();
  const props = renderLogin();

  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/password/i), 'password');
  await user.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => expect(props.setSignedIn).toHaveBeenCalledWith(true));

  expect(localStorage.getItem('token')).toBeTruthy();
  expect(localStorage.getItem('name')).toBe('Test User');
  expect(props.setShowLogin).toHaveBeenCalledWith(false);
  expect(props.setCredentials).toHaveBeenCalledWith({ name: 'Test User' });
});

test('renders invalid credentials when login fails', async () => {
  const user = userEvent.setup();
  const props = renderLogin();

  // The API responds 400 for an unknown user or wrong password
  mockPostRequest('users/login', 'Invalid Password', 400);

  await user.type(screen.getByLabelText(/username/i), 'bad-user');
  await user.type(screen.getByLabelText(/password/i), 'bad-password');
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/invalid login credentials/i)).toBeInTheDocument();
  expect(props.setSignedIn).not.toHaveBeenCalled();
});

test('allows retrying login after a failed attempt', async () => {
  const user = userEvent.setup();
  const props = renderLogin();

  mockPostRequest('users/login', { message: 'Invalid credentials' }, 401);

  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/password/i), 'wrong-password');
  await user.click(screen.getByRole('button', { name: /login/i }));
  expect(await screen.findByText(/invalid login credentials/i)).toBeInTheDocument();

  // Restore the default (successful) login handler and resubmit.
  server.resetHandlers();
  await user.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => expect(props.setSignedIn).toHaveBeenCalledWith(true));
  expect(screen.queryByText(/invalid login credentials/i)).not.toBeInTheDocument();
});

test('renders a generic error when login fails for another reason', async () => {
  const user = userEvent.setup();
  const props = renderLogin();

  mockPostRequest('users/login', { message: 'Server error' }, 500);

  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/password/i), 'password');
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/unable to log in. please try again./i)).toBeInTheDocument();
  expect(screen.queryByText(/invalid login credentials/i)).not.toBeInTheDocument();
  expect(props.setSignedIn).not.toHaveBeenCalled();
});
