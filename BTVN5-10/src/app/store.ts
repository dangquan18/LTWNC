import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productsSlice";
import { productsApi } from "../features/products/productsApi";

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  [productsApi.reducerPath]: productsApi.reducer,
});

// Tạo store mới mỗi lần gọi → mỗi test có store riêng, có thể nạp sẵn state.
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
