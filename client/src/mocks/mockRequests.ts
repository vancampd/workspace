import {
  mockDeleteRequestHandler,
  mockGetRequestHandler,
  mockPostRequestHandler,
  type RequestCallback,
} from './requestHandlers';
import { server } from './server';

export const mockGetRequest = (
  endpoint: string,
  responseBody: unknown,
  statusCode = 200,
  onRequest?: RequestCallback
) =>
  server.use(
    mockGetRequestHandler(endpoint, responseBody, statusCode, onRequest)
  );

export const mockPostRequest = (
  endpoint: string,
  responseBody: unknown,
  statusCode = 200,
  onRequest?: RequestCallback
) =>
  server.use(
    mockPostRequestHandler(endpoint, responseBody, statusCode, onRequest)
  );

export const mockDeleteRequest = (
  endpoint: string,
  responseBody: unknown,
  statusCode = 200,
  onRequest?: RequestCallback
) =>
  server.use(
    mockDeleteRequestHandler(endpoint, responseBody, statusCode, onRequest)
  );
