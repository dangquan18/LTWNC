import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchProductsFromServer } from "./productsService";
import { Product } from "../../types/Product";
import type { RootState } from "../../app/store";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface ProductsState {
  items: Product[];
  status: Status;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    return await fetchProductsFromServer();
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải sản phẩm";
      });
  },
});

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

export default productsSlice.reducer;
