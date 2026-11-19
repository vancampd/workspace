import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { mockPostRequest } from '../../mocks/mockRequests';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import SignUp from './SignUp';

const renderSignUp = () => {
  const props = {
    setShowRegister: vi.fn(),
    setShowLogin: vi.fn(),
  };

  renderWithProviders(<SignUp {...props} />);

  return props;
};

test('validates required sign up fields', async () => {
  const user = userEvent.setup();
  renderSignUp();

  await user.click(screen.getByRole('button', { name: /sign up/i }));

  expect(screen.getByText(/you must enter your name/i)).toBeInTheDocument();
  expect(screen.getByText(/you must enter a username/i)).toBeInTheDocument();
  expect(screen.getByText(/^you must enter a password$/i)).toBeInTheDocument();
  expect(screen.getByText(/you must confirm your password/i)).toBeInTheDocument();
});

test('validates password confirmation', async () => {
  const user = userEvent.setup();
  renderSignUp();

  await user.type(screen.getByLabelText(/^name:/i), 'Test User');
  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/^password:/i), 'password');
  await user.type(screen.getByLabelText(/confirm password/i), 'different');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
});

test('requires passwords to be at least 8 characters', async () => {
  const user = userEvent.setup();
  renderSignUp();

  await user.type(screen.getByLabelText(/^name:/i), 'Test User');
  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/^password:/i), 'short');
  await user.type(screen.getByLabelText(/confirm password/i), 'short');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  expect(
    screen.getByText(/password must be at least 8 characters/i)
  ).toBeInTheDocument();
});

test('revalidates password confirmation when the password changes', async () => {
  const user = userEvent.setup();
  renderSignUp();

  const passwordInput = screen.getByLabelText(/^password:/i);
  await user.type(screen.getByLabelText(/^name:/i), 'Test User');
  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(passwordInput, 'password');
  await user.type(screen.getByLabelText(/confirm password/i), 'different');
  await user.click(screen.getByRole('button', { name: /sign up/i }));
  expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();

  await user.clear(passwordInput);
  await user.type(passwordInput, 'different');

  await waitFor(() =>
    expect(screen.queryByText(/passwords don't match/i)).not.toBeInTheDocument()
  );
});

test('submits sign up form and opens login on success', async () => {
  const user = userEvent.setup();
  const props = renderSignUp();
  const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  const registerUser = vi.fn();

  mockPostRequest('users/register', { id: 'new-user-id' }, 200, async (req) =>
    registerUser(await req.json())
  );

  await user.type(screen.getByLabelText(/^name:/i), 'Test User');
  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/^password:/i), 'password');
  await user.type(screen.getByLabelText(/confirm password/i), 'password');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1));
  expect(registerUser).toHaveBeenCalledWith({
    name: 'Test User',
    username: 'test',
    password: 'password',
  });
  expect(alertSpy).toHaveBeenCalledWith('Registered Successfully');
  expect(props.setShowRegister).toHaveBeenCalledWith(false);
  expect(props.setShowLogin).toHaveBeenCalledWith(true);

  alertSpy.mockRestore();
});

test('renders sign up error when registration fails', async () => {
  const user = userEvent.setup();
  const props = renderSignUp();

  mockPostRequest('users/register', { message: 'Username taken' }, 400);

  await user.type(screen.getByLabelText(/^name:/i), 'Test User');
  await user.type(screen.getByLabelText(/username/i), 'test');
  await user.type(screen.getByLabelText(/^password:/i), 'password');
  await user.type(screen.getByLabelText(/confirm password/i), 'password');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  expect(
    await screen.findByText(/unable to register. please try again./i)
  ).toBeInTheDocument();
  expect(props.setShowLogin).not.toHaveBeenCalled();
});
