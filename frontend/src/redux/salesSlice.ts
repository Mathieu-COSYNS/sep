import { saleApi } from '~/api/saleAPI';
import { Sale } from '~/types/Sale';
import { AsyncState } from '../types/AsyncState';
import { useAppSelector } from './hooks';
import { createRestSlice } from './rest';
import { RootState } from './store';

export const { slice, extraReducers } = createRestSlice({
  name: 'sales',
  api: saleApi,
  sortCompareFn: (a, b) => b.created_date.localeCompare(a.created_date),
});

export const { fetchAll: loadSales, save: saveSale } = extraReducers;
export const selectSales = (state: RootState) => state.sales;
export const useSales = (): AsyncState<Sale[]> => useAppSelector(selectSales);

export default slice.reducer;
