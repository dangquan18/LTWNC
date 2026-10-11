import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { setupStore } from "../app/store";
import type { AppStore, RootState } from "../app/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

// Render component bên trong Redux Provider với store mới cho từng test.
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  return {
    store,
    ...render(ui, {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      ...renderOptions,
    }),
  };
}
