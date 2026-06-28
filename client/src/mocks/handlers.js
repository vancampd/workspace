import { rest } from 'msw';
import { mockListings } from './fixtures/listings';

const apiUrl = process.env.REACT_APP_EXPRESS_API_URL || 'http://localhost:8080/';

export const handlers = [
  rest.get(`${apiUrl}listings`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockListings));
  }),

  rest.get(`${apiUrl}favorites/:name`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),

  rest.post(`${apiUrl}users/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0In0.mock-signature',
      })
    );
  }),

  rest.get('https://maps.googleapis.com/maps/api/geocode/json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          {
            geometry: {
              location: {
                lat: 25.7617,
                lng: -80.1918,
              },
            },
          },
        ],
      })
    );
  }),
];
