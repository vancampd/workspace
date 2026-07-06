import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  type Location,
} from 'react-router-dom';

/* eslint-disable react-refresh/only-export-components */

type Provider = (children: ReactNode) => ReactElement;

type RenderWithProvidersOptions = RenderOptions & {
  route?: string;
  path?: string;
  providers?: Provider[];
  queryClient?: QueryClient;
  withRouter?: boolean;
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const applyProviders = (children: ReactNode, providers: Provider[]) =>
  providers.reduceRight((wrappedChildren, provider) => {
    return provider(wrappedChildren);
  }, children);

function LocationCapture({
  onLocationChange,
}: {
  onLocationChange: (location: Location) => void;
}) {
  const location = useLocation();

  useEffect(() => {
    onLocationChange(location);
  }, [location, onLocationChange]);

  return null;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    path,
    providers = [],
    queryClient = createTestQueryClient(),
    withRouter = true,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) => {
  let currentLocation: Location | undefined;
  const routedUi = path ? (
    <Routes>
      <Route path={path} element={ui} />
    </Routes>
  ) : (
    ui
  );
  const wrappedUi = applyProviders(routedUi, providers);
  const maybeRouter = withRouter ? (
    <MemoryRouter initialEntries={[route]}>
      <LocationCapture
        onLocationChange={(location) => {
          currentLocation = location;
        }}
      />
      {wrappedUi}
    </MemoryRouter>
  ) : (
    wrappedUi
  );

  return {
    getLocation: () => currentLocation,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>{maybeRouter}</QueryClientProvider>,
      renderOptions
    ),
  };
};
