import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { mockListings } from '../../mocks/fixtures/listings';
import {
  mockDeleteRequest,
  mockGetRequest,
  mockPostRequest,
} from '../../mocks/mockRequests';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import IndividualListing from './IndividualListing';

const firstListing = mockListings[0];
const credentials = { name: 'Test User' };

const renderIndividualListing = ({ signedIn = false } = {}) =>
  renderWithProviders(
    <IndividualListing signedIn={signedIn} credentials={credentials} />,
    {
      route: `/listings/miami/${firstListing.id}`,
      path: '/listings/:city/:listingID',
    }
  );

test('renders listing details and comments from the API', async () => {
  renderIndividualListing();

  expect(
    await screen.findByRole('heading', {
      name: /work space office and conference room/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByText(firstListing.description)).toBeInTheDocument();
  expect(screen.getAllByText(firstListing.price).length).toBeGreaterThan(0);
  expect(screen.getByText(/name: billy/i)).toBeInTheDocument();
  expect(screen.getByText(/phone: 305-722-6482/i)).toBeInTheDocument();
  expect(screen.getByText(/air conditioning/i)).toBeInTheDocument();
  expect(screen.getByText(/love the feng shui/i)).toBeInTheDocument();
});

test('switches the main image on an individual listing', async () => {
  renderIndividualListing();

  const mainImage = (await screen.findByAltText(
    /office overview/i
  )) as HTMLImageElement;
  expect(mainImage.src).toContain('image1.jpeg');

  const sideImages = screen.getAllByAltText(/listing/i);
  userEvent.click(sideImages[0]);

  expect(mainImage.src).toContain('image2.jpeg');
});

test('shows a sign-in warning when a signed-out user tries to favorite a listing', async () => {
  renderIndividualListing();

  userEvent.click(await screen.findByAltText(/like button/i));

  expect(
    screen.getByText(/you must be signed in to like a post/i)
  ).toBeInTheDocument();
});

test('adds and removes a favorite for a signed-in user', async () => {
  const addFavorite = vi.fn();
  const removeFavorite = vi.fn();

  mockGetRequest('favorites/:name', []);
  mockPostRequest('favorites/:name', [firstListing], 200, () => addFavorite());
  mockDeleteRequest('favorites/:name', [], 200, () => removeFavorite());

  renderIndividualListing({ signedIn: true });

  const favoriteButton = await screen.findByAltText(/like button/i);
  userEvent.click(favoriteButton);
  await waitFor(() => expect(addFavorite).toHaveBeenCalledTimes(1));

  userEvent.click(favoriteButton);
  await waitFor(() => expect(removeFavorite).toHaveBeenCalledTimes(1));
});

test('validates missing comment text and rating for signed-in users', async () => {
  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/you must leave a rating/i)).toBeInTheDocument();
  expect(
    screen.getByText(/text is required in the review field/i)
  ).toBeInTheDocument();
});

test('submits a signed-in user review', async () => {
  const createComment = vi.fn();
  const reviewText = 'Quiet, bright, and easy to book.';
  const updatedListing = {
    ...firstListing,
    comments: [
      ...firstListing.comments,
      {
        commentID: 'new-comment-id',
        name: credentials.name,
        comment: reviewText,
        rating: 5,
        date: Date.now(),
      },
    ],
  };

  mockPostRequest(
    'listings/:listingID/comments',
    updatedListing,
    200,
    () => createComment()
  );

  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  userEvent.type(screen.getByPlaceholderText(/leave review here/i), reviewText);
  userEvent.click(screen.getAllByAltText(/empty star/i)[4]);
  userEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(createComment).toHaveBeenCalledTimes(1));
  expect(await screen.findByText(reviewText)).toBeInTheDocument();
});

test('deletes a signed-in user review', async () => {
  const deleteComment = vi.fn();
  const ownComment = {
    commentID: 'own-comment-id',
    name: credentials.name,
    comment: 'Please remove this review.',
    rating: 4,
    date: Date.now(),
  };
  const listingWithOwnComment = {
    ...firstListing,
    comments: [...firstListing.comments, ownComment],
  };
  const listingAfterDelete = {
    ...firstListing,
    comments: firstListing.comments,
  };

  mockGetRequest('listings', [listingWithOwnComment]);
  mockDeleteRequest(
    'listings/:listingID/comments/:commentID',
    listingAfterDelete,
    200,
    () => deleteComment()
  );

  renderIndividualListing({ signedIn: true });

  expect(await screen.findByText(ownComment.comment)).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => expect(deleteComment).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(screen.queryByText(ownComment.comment)).not.toBeInTheDocument()
  );
});
