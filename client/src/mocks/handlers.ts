import { mockListings } from "./fixtures/listings";
import {
  mockGetRequestHandler,
  mockPostRequestHandler,
} from "./requestHandlers";

export const handlers = [
  mockGetRequestHandler("listings", mockListings),
  mockGetRequestHandler("favorites/:name", []),
  mockPostRequestHandler("users/login", {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0In0.mock-signature",
  }),
  mockGetRequestHandler("https://maps.googleapis.com/maps/api/geocode/json", {
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
  }),
];
