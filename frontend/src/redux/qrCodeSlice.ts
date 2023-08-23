import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from '@/types/Product';
import { AsyncState } from '../types/AsyncState';
import { RootState } from './store';
import { addAsyncThunk } from './utils';
import { productApi } from '@/api/productAPI';
import { useAppSelector } from './hooks';
import { Id } from '@/types/Id';
import { Pack } from '@/types/Pack';
import { packApi } from '@/api/packAPI';

type QrCodeData = { type: 'product' | 'pack'; value: Product | Pack };

type QrCodeState = AsyncState<QrCodeData>;

const initialState: QrCodeState = {
  isLoading: true,
};

export const loadQrCode = createAsyncThunk(
  'products/fetchProductById',
  async ({ type, id }: { type: string; id: Id }, { rejectWithValue }) => {
    try {
      if (type === 'product') {
        const response = await productApi.fetchById(id);
        return { type, value: response };
      }
      if (type === 'pack') {
        const response = await packApi.fetchById(id);
        return { type, value: response };
      }
      return rejectWithValue('Type inconnu');
    } catch (e) {
      return rejectWithValue(JSON.stringify(e));
    }
  },
);

export const qrCodeSlice = createSlice({
  name: 'qrCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncThunk(builder, loadQrCode);
  },
});

export const selectQrCode = (state: RootState): QrCodeState => state.qrCode;
export const useQrCode = (): AsyncState<QrCodeData> => useAppSelector(selectQrCode);

export default qrCodeSlice.reducer;
