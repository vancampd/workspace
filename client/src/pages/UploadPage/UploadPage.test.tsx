import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import UploadPage from './UploadPage';

const credentials = { name: 'Test User' };

test('blocks unauthenticated users from the upload form', () => {
  renderWithProviders(<UploadPage signedIn={false} credentials={credentials} />);

  expect(
    screen.getByText(/you must be logged in to post your space/i)
  ).toBeInTheDocument();
});

test('validates required upload form fields before advancing', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await user.click(await screen.findByRole('button', { name: /next/i }));

  expect(
    screen.getByText(/you must enter the title of your post/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/you must write the description of your space/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/you must list your daily price/i)).toBeInTheDocument();
});
