import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

// jsdom has no WebGL, so replace the MapLibre wrapper with lightweight stand-ins.
vi.mock('react-map-gl/maplibre', async () => {
  const { createElement } = await import('react');
  type Props = { children?: React.ReactNode };
  return {
    Map: ({ children }: Props) => createElement('div', { 'data-testid': 'map' }, children),
    Marker: ({ children }: Props) => createElement('div', { 'data-testid': 'map-marker' }, children),
  };
});
