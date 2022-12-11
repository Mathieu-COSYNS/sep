import { AsyncState } from '../types/AsyncState';
import { RootState } from './store';
import { useAppSelector } from './hooks';
import { Pack } from '@/types/Pack';
import { packApi } from '@/api/packAPI';
import { createRestSlice } from './rest';

export const { slice, extraReducers } = createRestSlice({
  name: 'packs',
  api: packApi,
});

export const { fetchAll: loadPacks } = extraReducers;
export const selectPacks = (state: RootState) => state.packs;
export const usePacks = (): AsyncState<Pack[]> => useAppSelector(selectPacks);

export default slice.reducer;
