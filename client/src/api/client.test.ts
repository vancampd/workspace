import { vi } from 'vitest';
import { mockGetRequest } from '../mocks/mockRequests';
import { apiClient } from './client';

test('sends the stored token as a bearer token', async () => {
  const onRequest = vi.fn();
  localStorage.setItem('token', 'test-token');
  mockGetRequest('listings', [], 200, (req) =>
    onRequest(req.headers.get('Authorization'))
  );

  await apiClient.get('listings');

  expect(onRequest).toHaveBeenCalledWith('Bearer test-token');
});

test('omits the Authorization header when signed out', async () => {
  const onRequest = vi.fn();
  mockGetRequest('listings', [], 200, (req) =>
    onRequest(req.headers.get('Authorization'))
  );

  await apiClient.get('listings');

  expect(onRequest).toHaveBeenCalledWith(null);
});
