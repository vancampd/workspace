export const queryKeys = {
  listings: ['listings'] as const,
  listing: (listingId: string) => ['listings', listingId] as const,
  cityListings: (city: string) => ['listings', 'city', city] as const,
  favorites: (name: string) => ['favorites', name] as const,
  geocode: (address: string) => ['geocode', address] as const,
};
