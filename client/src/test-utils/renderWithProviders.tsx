import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import type { MemoryHistory } from 'history';
import type { ReactElement, ReactNode } from 'react';
import { Route, Router } from 'react-router-dom';

type Provider = (children: ReactNode) => ReactElement;

type RenderWithProvidersOptions = RenderOptions & {
  route?: string;
  path?: string;
  providers?: Provider[];
};

const applyProviders = (children: ReactNode, providers: Provider[]) =>
  providers.reduceRight((wrappedChildren, provider) => {
    return provider(wrappedChildren);
  }, children);

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    path,
    providers = [],
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const routedUi = path ? <Route path={path}>{ui}</Route> : ui;
  const wrappedUi = applyProviders(routedUi, providers);

  return {
    history: history as MemoryHistory,
    ...render(
      <Router history={history}>{wrappedUi}</Router>,
      renderOptions
    ),
  };
};
