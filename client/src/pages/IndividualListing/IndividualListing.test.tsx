import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { mockListings } from '../../mocks/fixtures/listings';
import {
  mockDeleteRequest,
  mockGetRequest,
  mockPostRequest,
} from '../../mocks/mockRequests';
import { server } from '../../mocks/server';
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
  const user = userEvent.setup();
  renderIndividualListing();

  const mainImage = (await screen.findByAltText(
    /office overview/i
  )) as HTMLImageElement;
  expect(mainImage.src).toContain('image1.jpeg');

  const sideImages = screen.getAllByAltText(/listing/i);
  await user.click(sideImages[0]);

  await waitFor(() =>
    expect((screen.getByAltText(/office overview/i) as HTMLImageElement).src).toContain(
      'image2.jpeg'
    )
  );
});

test('shows a sign-in warning when a signed-out user tries to favorite a listing', async () => {
  const user = userEvent.setup();
  renderIndividualListing();

  await user.click(await screen.findByAltText(/like button/i));

  expect(
    await screen.findByText(/you must be signed in to like a post/i)
  ).toBeInTheDocument();
});

test('adds and removes a favorite for a signed-in user', async () => {
  const user = userEvent.setup();
  const addFavorite = vi.fn();
  const removeFavorite = vi.fn();

  mockGetRequest('favorites/:name', []);
  mockPostRequest('favorites/:name', [firstListing], 200, () => addFavorite());
  mockDeleteRequest('favorites/:name/:listingId', [], 200, () => removeFavorite());

  renderIndividualListing({ signedIn: true });

  const favoriteButton = await screen.findByAltText(/like button/i);
  await user.click(favoriteButton);
  await waitFor(() => expect(addFavorite).toHaveBeenCalledTimes(1));

  await user.click(favoriteButton);
  await waitFor(() => expect(removeFavorite).toHaveBeenCalledTimes(1));
});

test('validates missing comment text and rating for signed-in users', async () => {
  const user = userEvent.setup();
  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(/you must leave a rating/i)).toBeInTheDocument();
  expect(
    screen.getByText(/text is required in the review field/i)
  ).toBeInTheDocument();
});

test('clears comment form validation after valid input is provided', async () => {
  const user = userEvent.setup();
  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/you must leave a rating/i)).toBeInTheDocument();
  expect(screen.getByText(/text is required in the review field/i)).toBeInTheDocument();

  await user.click(screen.getAllByAltText(/empty star/i)[3]);
  await user.type(screen.getByPlaceholderText(/leave review here/i), 'Looks great.');

  await waitFor(() =>
    expect(screen.queryByText(/you must leave a rating/i)).not.toBeInTheDocument()
  );
  expect(
    screen.queryByText(/text is required in the review field/i)
  ).not.toBeInTheDocument();
});

test('cancels and resets a signed-in user review form', async () => {
  const user = userEvent.setup();
  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  await user.type(screen.getByPlaceholderText(/leave review here/i), 'Draft review');
  await user.click(screen.getAllByAltText(/empty star/i)[2]);
  await user.click(screen.getByRole('button', { name: /cancel/i }));

  expect(screen.getByPlaceholderText(/leave review here/i)).toHaveValue('');
  expect(screen.getAllByAltText(/empty star/i).length).toBeGreaterThan(0);
});

test('submits a signed-in user review', async () => {
  const user = userEvent.setup();
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
    async (req) => createComment(await req.json())
  );

  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  await user.type(screen.getByPlaceholderText(/leave review here/i), reviewText);
  await user.click(screen.getAllByAltText(/empty star/i)[4]);
  await user.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => expect(createComment).toHaveBeenCalledTimes(1));
  expect(createComment).toHaveBeenCalledWith({
    listingID: firstListing.id,
    name: credentials.name,
    comment: reviewText,
    rating: 5,
  });
  expect(await screen.findByText(reviewText)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/leave review here/i)).toHaveValue('');
});

test('preserves a review when submission fails', async () => {
  const user = userEvent.setup();
  const reviewText = 'Please keep this draft.';

  mockPostRequest(
    'listings/:listingID/comments',
    { message: 'Unable to create comment' },
    500
  );
  renderIndividualListing({ signedIn: true });

  await screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });
  const reviewInput = screen.getByPlaceholderText(/leave review here/i);
  const reviewForm = reviewInput.closest('form');

  await user.type(reviewInput, reviewText);
  await user.click(within(reviewForm!).getAllByAltText(/empty star/i)[3]);
  await user.click(within(reviewForm!).getByRole('button', { name: /submit/i }));

  expect(
    await within(reviewForm!).findByText(/unable to submit your review/i)
  ).toBeInTheDocument();
  expect(reviewInput).toHaveValue(reviewText);
  expect(within(reviewForm!).getAllByAltText(/^star$/i)).toHaveLength(4);
});

test('deletes a signed-in user review', async () => {
  const user = userEvent.setup();
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
  await user.click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => expect(deleteComment).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(screen.queryByText(ownComment.comment)).not.toBeInTheDocument()
  );
});

const waitForListing = () =>
  screen.findByRole('heading', {
    name: /work space office and conference room/i,
  });

const fillReview = async (
  user: ReturnType<typeof userEvent.setup>,
  reviewText: string
) => {
  const reviewInput = screen.getByPlaceholderText(/leave review here/i);
  const reviewForm = reviewInput.closest('form')!;

  await user.type(reviewInput, reviewText);
  await user.click(within(reviewForm).getAllByAltText(/empty star/i)[3]);

  return reviewForm;
};

test('allows retrying a review after a failed submission', async () => {
  const user = userEvent.setup();
  const reviewText = 'Second time is the charm.';
  const updatedListing = {
    ...firstListing,
    comments: [
      ...firstListing.comments,
      {
        commentID: 'retried-comment-id',
        name: credentials.name,
        comment: reviewText,
        rating: 4,
        date: Date.now(),
      },
    ],
  };

  mockPostRequest(
    'listings/:listingID/comments',
    { message: 'Unable to create comment' },
    500
  );
  renderIndividualListing({ signedIn: true });

  await waitForListing();
  const reviewForm = await fillReview(user, reviewText);
  await user.click(within(reviewForm).getByRole('button', { name: /submit/i }));
  expect(
    await within(reviewForm).findByText(/unable to submit your review/i)
  ).toBeInTheDocument();

  server.resetHandlers();
  mockPostRequest('listings/:listingID/comments', updatedListing);
  await user.click(within(reviewForm).getByRole('button', { name: /submit/i }));

  expect(await screen.findByText(reviewText)).toBeInTheDocument();
  expect(
    within(reviewForm).queryByText(/unable to submit your review/i)
  ).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText(/leave review here/i)).toHaveValue('');
});

test('clears a review submission error when the review is cancelled', async () => {
  const user = userEvent.setup();

  mockPostRequest(
    'listings/:listingID/comments',
    { message: 'Unable to create comment' },
    500
  );
  renderIndividualListing({ signedIn: true });

  await waitForListing();
  const reviewForm = await fillReview(user, 'Draft that fails');
  await user.click(within(reviewForm).getByRole('button', { name: /submit/i }));
  expect(
    await within(reviewForm).findByText(/unable to submit your review/i)
  ).toBeInTheDocument();

  await user.click(within(reviewForm).getByRole('button', { name: /cancel/i }));

  expect(
    within(reviewForm).queryByText(/unable to submit your review/i)
  ).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText(/leave review here/i)).toHaveValue('');
});
