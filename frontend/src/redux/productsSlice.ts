import { productApi } from '~/api/productAPI';
import { Product } from '~/types/Product';
import { AsyncState } from '../types/AsyncState';
import { useAppSelector } from './hooks';
import { createRestSlice } from './rest';
import { RootState } from './store';

export const { slice, extraReducers } = createRestSlice({
  name: 'products',
  api: productApi,
});

export const { fetchAll: loadProducts } = extraReducers;
export const selectProducts = (state: RootState) => state.products;
export const useProducts = (): AsyncState<Product[]> => useAppSelector(selectProducts);

export default slice.reducer;
