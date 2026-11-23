import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import {
  mockGetRequest,
  mockPostRequest,
} from '../../mocks/mockRequests';
import { apiClient } from '../../api/client';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import UploadPage from './UploadPage';

const credentials = { name: 'Test User' };
const image = () => new File(['image'], 'workspace.png', { type: 'image/png' });

type User = ReturnType<typeof userEvent.setup>;

// MSW 1.x cannot read multipart bodies, so capture the FormData at the axios layer.
let sentForms: FormData[] = [];
let interceptorId: number;

beforeEach(() => {
  sentForms = [];
  interceptorId = apiClient.interceptors.request.use((config) => {
    if (config.data instanceof FormData) sentForms.push(config.data);
    return config;
  });
});

afterEach(() => {
  apiClient.interceptors.request.eject(interceptorId);
});

const fillRequiredStepOne = async (user: User) => {
  await user.type(screen.getByLabelText(/give a title/i), 'Sunny desk');
  await user.type(screen.getByLabelText(/describe your space/i), 'A bright desk');
  await user.click(screen.getByLabelText(/^daily$/i));
  await user.type(screen.getByLabelText(/daily price/i), '25');
};

const advanceToStepTwo = async (user: User) => {
  await fillRequiredStepOne(user);
  await user.click(screen.getByRole('button', { name: /next/i }));
};

const fillRequiredStepTwo = async (user: User) => {
  await user.type(screen.getByLabelText(/street address/i), '123 Main St');
  await user.type(screen.getByLabelText(/city/i), 'Miami');
  await user.selectOptions(screen.getByLabelText(/state/i), 'FL');
  await user.type(screen.getByLabelText(/zip code/i), '33101');
};

const advanceToStepThree = async (user: User) => {
  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.click(screen.getByRole('button', { name: /next/i }));
  await screen.findByRole('heading', { name: /contact info/i });
};

const advanceToImageStep = async (user: User, field: RegExp = /email/i, value = 'test@example.com') => {
  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(field), value);
  await user.click(nextButton());
  return screen.findByLabelText(/image/i);
};

const fillStepThree = async (user: User) => {
  const imageInput = await advanceToImageStep(user);
  await user.upload(imageInput, image());
};

const nextButton = () => screen.getByRole('button', { name: /next/i });
const postButton = () => screen.getByRole('button', { name: /post listing/i });

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
  expect(screen.getByText(/you must leave a time period/i)).toBeInTheDocument();
  expect(screen.getByText(/you must list your daily price/i)).toBeInTheDocument();
});

test('re-validates step one fields as the user corrects them', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await user.click(await screen.findByRole('button', { name: /next/i }));
  expect(
    screen.getByText(/you must enter the title of your post/i)
  ).toBeInTheDocument();

  await user.type(screen.getByLabelText(/give a title/i), 'S');
  await waitFor(() =>
    expect(
      screen.queryByText(/you must enter the title of your post/i)
    ).not.toBeInTheDocument()
  );

  await user.click(screen.getByLabelText(/^daily$/i));
  await waitFor(() =>
    expect(screen.queryByText(/you must leave a time period/i)).not.toBeInTheDocument()
  );
});

test('advances to location step after valid listing details', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);

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
  expect(screen.getByText(/you must enter the zip code/i)).toBeInTheDocument();
});

test('validates the zip code format', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.clear(screen.getByLabelText(/zip code/i));
  await user.type(screen.getByLabelText(/zip code/i), '123');
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByText(/please enter a valid 5-digit zip code/i)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /contact info/i })).not.toBeInTheDocument();
});

test('geocodes the full address before leaving the location step', async () => {
  const user = userEvent.setup();
  const geocode = vi.fn();

  mockGetRequest('geocode', { lat: 25.7617, lng: -80.1918 }, 200, (req) =>
    geocode(req.url.searchParams.get('address'))
  );
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);

  expect(geocode).toHaveBeenCalledWith('123 Main St, Miami, FL 33101');
});

test('blocks the location step when the address cannot be found', async () => {
  const user = userEvent.setup();

  mockGetRequest('geocode', { message: 'No geocode result found' }, 404);
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(
    await screen.findByText(/we could not verify this address/i)
  ).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /contact info/i })).not.toBeInTheDocument();
});

test('blocks the location step when the address is only a partial match', async () => {
  const user = userEvent.setup();

  mockGetRequest('geocode', { lat: 1, lng: 2, partialMatch: true });
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.click(screen.getByRole('button', { name: /next/i }));

  expect(
    await screen.findByText(/we could not verify this address/i)
  ).toBeInTheDocument();
});

test('clears the address error once the address is edited', async () => {
  const user = userEvent.setup();

  mockGetRequest('geocode', { message: 'No geocode result found' }, 404);
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepTwo(user);
  await fillRequiredStepTwo(user);
  await user.click(screen.getByRole('button', { name: /next/i }));
  await screen.findByText(/we could not verify this address/i);

  await user.type(screen.getByLabelText(/street address/i), '0');

  await waitFor(() =>
    expect(
      screen.queryByText(/we could not verify this address/i)
    ).not.toBeInTheDocument()
  );
});

test('validates contact method before advancing to the image step', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.click(nextButton());

  expect(
    screen.getByText(/either a valid phone or a valid email is required/i)
  ).toBeInTheDocument();
  expect(screen.queryByLabelText(/image/i)).not.toBeInTheDocument();
});

test('validates the image before posting a listing', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToImageStep(user);
  await user.click(postButton());

  expect(screen.getByText(/you must upload an image/i)).toBeInTheDocument();
});

test('clears contact validation when a valid phone number is entered', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.click(nextButton());
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
  await user.click(nextButton());

  expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
});

test.each([
  ['(305) 555-0123', true],
  ['305.555.0123', true],
  ['+1 305 555 0123', true],
  ['(305 555-0123x', false],
  ['305-555-012', false],
])('phone validation for %s', async (phone, isValid) => {
  const user = userEvent.setup();
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await advanceToStepThree(user);
  await user.type(screen.getByLabelText(/phone/i), phone);
  await user.click(nextButton());

  const error = screen.queryByText(/please enter a valid phone number/i);
  if (isValid) expect(error).not.toBeInTheDocument();
  else expect(error).toBeInTheDocument();
});

test('posts the listing and image as one multipart request, then navigates to the city', async () => {
  const user = userEvent.setup();

  mockPostRequest('listings', { id: 'new-listing-id' });
  const { getLocation } = renderWithProviders(
    <UploadPage signedIn={true} credentials={credentials} />,
    { route: '/post' }
  );

  await fillStepThree(user);
  await user.click(postButton());

  await waitFor(() => expect(getLocation()?.pathname).toBe('/listings/miami'));
  expect(sentForms).toHaveLength(1);

  const file = sentForms[0].get('file') as File;
  expect(file.name).toBe('workspace.png');
  expect(JSON.parse(sentForms[0].get('listing') as string)).toEqual({
    title: 'Sunny desk',
    description: 'A bright desk',
    rentPeriod: ['Daily'],
    amenities: [],
    price: '25',
    streetAddress: '123 Main St',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    phone: '',
    email: 'test@example.com',
    name: 'Test User',
    coordinates: { lat: '25.7617', lng: '-80.1918' },
  });
});

test('posts a listing with only a phone number for contact', async () => {
  const user = userEvent.setup();

  mockPostRequest('listings', { id: 'new-listing-id' });
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  const imageInput = await advanceToImageStep(user, /phone/i, '305-555-0123');
  await user.upload(imageInput, image());
  await user.click(postButton());

  await waitFor(() => expect(sentForms).toHaveLength(1));
  expect(JSON.parse(sentForms[0].get('listing') as string)).toEqual(
    expect.objectContaining({ phone: '305-555-0123', email: '' })
  );
});

test('renders an error and allows retrying when posting fails', async () => {
  const user = userEvent.setup();

  mockPostRequest('listings', { message: 'Failed' }, 500);
  const { getLocation } = renderWithProviders(
    <UploadPage signedIn={true} credentials={credentials} />,
    { route: '/post' }
  );

  await fillStepThree(user);
  await user.click(postButton());

  expect(
    await screen.findByText(/unable to post listing. please try again./i)
  ).toBeInTheDocument();
  expect(getLocation()?.pathname).toBe('/post');

  mockPostRequest('listings', { id: 'new-listing-id' });
  await user.click(postButton());

  await waitFor(() => expect(getLocation()?.pathname).toBe('/listings/miami'));
});

test('disables posting while the listing is being created', async () => {
  const user = userEvent.setup();
  let resolveCreateListing!: () => void;
  const createListingRequest = new Promise<void>((resolve) => {
    resolveCreateListing = resolve;
  });

  mockPostRequest('listings', { id: 'new-listing-id' }, 200, () => createListingRequest);
  renderWithProviders(<UploadPage signedIn={true} credentials={credentials} />);

  await fillStepThree(user);
  const button = postButton();
  await user.click(button);

  await waitFor(() => expect(button).toBeDisabled());

  resolveCreateListing();
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
  expect(screen.getByLabelText(/zip code/i)).toHaveValue('33101');
});
