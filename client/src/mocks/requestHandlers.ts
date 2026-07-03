import { rest } from 'msw';
import type { DefaultBodyType, PathParams, RestRequest } from 'msw';

const apiUrl = import.meta.env.VITE_EXPRESS_API_URL || 'http://localhost:8080/';

export type RequestCallback = (
  req: RestRequest<DefaultBodyType, PathParams>
) => void;

const getMockUrl = (endpoint: string) => {
  if (endpoint.startsWith('http')) return endpoint;

  return `${apiUrl}${endpoint.replace(/^\/+/, '')}`;
};

const jsonResponseResolver =
  (responseBody: unknown, statusCode: number, onRequest?: RequestCallback) =>
  (req, res, ctx) => {
    onRequest?.(req);

    return res(ctx.status(statusCode), ctx.json(responseBody));
  };

export const mockGetRequestHandler = (
  endpoint: string,
  responseBody: unknown,
  statusCode = 200,
  onRequest?: RequestCallback
) =>
  rest.get(
    getMockUrl(endpoint),
    jsonResponseResolver(responseBody, statusCode, onRequest)
  );

export const mockPostRequestHandler = (
  endpoint: string,
  responseBody: unknown,
  statusCode = 200,
  onRequest?: RequestCallback
) =>
  rest.post(
    getMockUrl(endpoint),
    jsonResponseResolver(responseBody, statusCode, onRequest)
  );

export const mockDeleteRequestHandler = (
  endpoint: string,
  responseBody: unknown,
  statusCode = 200,
  onRequest?: RequestCallback
) =>
  rest.delete(
    getMockUrl(endpoint),
    jsonResponseResolver(responseBody, statusCode, onRequest)
  );
