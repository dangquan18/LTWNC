import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchProductsFromServer } from "./productsService";
import { Product } from "../../types/Product";

/**
 * Bonus: cùng một nguồn dữ liệu giả lập với productsSlice, nhưng lấy qua
 * RTK Query thay vì createAsyncThunk thủ công (tự cache, tự quản lý
 * loading/error qua hook useGetProductsQuery).
 */
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fakeBaseQuery<string>(),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      async queryFn() {
        try {
          const data = await fetchProductsFromServer();
          return { data };
        } catch (err) {
          return { error: (err as Error).message };
        }
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
