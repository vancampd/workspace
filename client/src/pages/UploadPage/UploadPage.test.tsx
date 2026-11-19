import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  mockGetRequest,
  mockPostRequest,
} from '../../mocks/mockRequests';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import UploadPage from './UploadPage';

const credentials = { name: 'Test User' };

const fillRequiredStepOne = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/give a title/i), 'Sunny desk');
  await user.type(screen.getByLabelText(/describe your space/i), 'A bright desk');
  await user.click(screen.getByLabelText(/^daily$/i));
  await user.type(screen.getByLabelText(/daily price/i), '25');
};

const advanceToStepTwo = async (user: ReturnType<typeof userEvent.setup>) => {
  await fillRequiredStepOne(user);
  await user.click(screen.getByRole('button', { name: /next/i }));
};

const fillRequiredStepTwo = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/street address/i), '123 Main St');
  await user.type(screen.getByLabelText(/city/i), 'Miami');
  await user.selectOptions(screen.getByLabelText(/state/i), 'FL');
};

const advanceToStepThree = async (user: ReturnType<typeof userEvent.setup>) => {
  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.click(screen.getByRole('button', { name: /next/i }));
};

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

test('advances to location step after valid listing details', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await fillRequiredStepOne(user);
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByRole('heading', { name: /location/i })).toBeInTheDocument();
});

test('validates required location fields before advancing', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByText(/you must enter the street address/i)).toBeInTheDocument();
  expect(screen.getByText(/you must enter the city/i)).toBeInTheDocument();
  expect(screen.getByText(/you must select a state/i)).toBeInTheDocument();
});

test('validates contact method before posting a listing', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(
    screen.getByText(/either a valid phone or a valid email is required/i)
  ).toBeInTheDocument();
});

test('clears contact validation when a valid phone number is entered', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.click(screen.getByRole('button', { name: /next/i }));
  expect(
    screen.getByText(/either a valid phone or a valid email is required/i)
  ).toBeInTheDocument();

  await user.type(screen.getByLabelText(/phone/i), '305-555-0123');

  await waitFor(() =>
    expect(
      screen.queryByText(/either a valid phone or a valid email is required/i)
    ).not.toBeInTheDocument()
  );
});

test('validates invalid contact formats', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/phone/i), '123');
  await user.type(screen.getByLabelText(/email/i), 'not-an-email');
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
});

test('posts a listing and advances to image upload', async () => {
  const user = userEvent.setup();
  const createListing = vi.fn();

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 });
  mockPostRequest('listings', { id: 'new-listing-id' }, 200, () =>
    createListing()
  );
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => expect(createListing).toHaveBeenCalledTimes(1));
  expect(await screen.findByLabelText(/images/i)).toBeInTheDocument();
});

test('renders listing submission error when geocoding fails', async () => {
  const user = userEvent.setup();

  mockGetRequest('geocode', { message: 'No geocode result found' }, 404);
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(
    await screen.findByText(/unable to post listing. please try again./i)
  ).toBeInTheDocument();
});

test('validates missing image upload', async () => {
  const user = userEvent.setup();

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 });
  mockPostRequest('listings', { id: 'new-listing-id' });
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /next/i }));
  await user.click(await screen.findByRole('button', { name: /submit/i }));

  expect(screen.getByText(/you must upload an image/i)).toBeInTheDocument();
});

test('uploads a listing image after listing creation', async () => {
  const user = userEvent.setup();
  const uploadImage = vi.fn();

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 });
  mockPostRequest('listings', { id: 'new-listing-id' });
  mockPostRequest('listings/:listingId/images', {}, 200, () => uploadImage());
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /next/i }));

  const file = new File(['image'], 'workspace.png', { type: 'image/png' });
  await user.upload(await screen.findByLabelText(/images/i), file);
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(uploadImage).toHaveBeenCalledTimes(1));
});

test('disables posting while the listing is being created', async () => {
  const user = userEvent.setup();
  let resolveCreateListing!: () => void;
  const createListingRequest = new Promise<void>((resolve) => {
    resolveCreateListing = resolve;
  });

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 });
  mockPostRequest('listings', { id: 'new-listing-id' }, 200, () => createListingRequest);
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  const postButton = screen.getByRole('button', { name: /next/i });
  await user.click(postButton);

  await waitFor(() => expect(postButton).toBeDisabled());

  resolveCreateListing();
  expect(await screen.findByLabelText(/images/i)).toBeInTheDocument();
});

const advanceToImageStep = async (user: ReturnType<typeof userEvent.setup>) => {
  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /next/i }));
  return screen.findByLabelText(/images/i);
};

test('posts the listing payload with owner, coordinates, and empty collections', async () => {
  const user = userEvent.setup();
  const createListing = vi.fn();

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 });
  mockPostRequest('listings', { id: 'new-listing-id' }, 200, async (req) =>
    createListing(await req.json())
  );
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToImageStep(user);

  expect(createListing).toHaveBeenCalledTimes(1);
  expect(createListing).toHaveBeenCalledWith({
    title: 'Sunny desk',
    description: 'A bright desk',
    rentPeriod: ['Daily'],
    amenities: [],
    price: '25',
    streetAddress: '123 Main St',
    city: 'Miami',
    state: 'FL',
    phone: '',
    email: 'test@example.com',
    name: 'Test User',
    comments: [],
    images: [],
    coordinates: { lat: '25.7617', lng: '-80.1918' },
  });
});

test('posts a listing with only a phone number for contact', async () => {
  const user = userEvent.setup();
  const createListing = vi.fn();

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 });
  mockPostRequest('listings', { id: 'new-listing-id' }, 200, async (req) =>
    createListing(await req.json())
  );
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/phone/i), '305-555-0123');
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(await screen.findByLabelText(/images/i)).toBeInTheDocument();
  expect(createListing).toHaveBeenCalledWith(
    expect.objectContaining({ phone: '305-555-0123', email: '' })
  );
});

test('allows retrying a listing post after a failure', async () => {
  const user = userEvent.setup();

  mockGetRequest('geocode', { message: 'No geocode result found' }, 404);
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /next/i }));
  expect(
    await screen.findByText(/unable to post listing. please try again./i)
  ).toBeInTheDocument();

  // Default handlers include a successful geocode response
  server.resetHandlers();
  mockPostRequest('listings', { id: 'new-listing-id' });
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(await screen.findByLabelText(/images/i)).toBeInTheDocument();
  expect(
    screen.queryByText(/unable to post listing. please try again./i)
  ).not.toBeInTheDocument();
});

test('keeps entered values when navigating back between steps', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.click(screen.getByRole('button', { name: /back/i }));

  expect(screen.getByLabelText(/give a title/i)).toHaveValue('Sunny desk');
  expect(screen.getByLabelText(/describe your space/i)).toHaveValue('A bright desk');
  expect(screen.getByLabelText(/^daily$/i)).toBeChecked();
  expect(screen.getByLabelText(/daily price/i)).toHaveValue(25);

  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByLabelText(/street address/i)).toHaveValue('123 Main St');
  expect(screen.getByLabelText(/city/i)).toHaveValue('Miami');
  expect(screen.getByLabelText(/state/i)).toHaveValue('FL');
});

test('navigates to the city listings after the image uploads', async () => {
  const user = userEvent.setup();

  mockPostRequest('listings', { id: 'new-listing-id' });
  mockPostRequest('listings/:listingId/images', {});
  const { getLocation } = renderWithProviders(
    <UploadPage signedIn={true} credentials={credentials} />,
    { route: '/post' }
  );

  const imageInput = await advanceToImageStep(user);
  await user.upload(
    imageInput,
    new File(['image'], 'workspace.png', { type: 'image/png' })
  );
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(getLocation()?.pathname).toBe('/listings/Miami'));
});

test('renders an error when the image upload fails', async () => {
  const user = userEvent.setup();

  mockPostRequest('listings', { id: 'new-listing-id' });
  mockPostRequest('listings/:listingId/images', { message: 'Upload failed' }, 500);
  const { getLocation } = renderWithProviders(
    <UploadPage signedIn={true} credentials={credentials} />,
    { route: '/post' }
  );

  const imageInput = await advanceToImageStep(user);
  await user.upload(
    imageInput,
    new File(['image'], 'workspace.png', { type: 'image/png' })
  );
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(
    await screen.findByText(/image upload failed. please try again./i)
  ).toBeInTheDocument();
  expect(getLocation()?.pathname).toBe('/post');
});
