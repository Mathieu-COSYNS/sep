import { packApi } from '~/api/packAPI';
import { Pack } from '~/types/Pack';
import { AsyncState } from '../types/AsyncState';
import { useAppSelector } from './hooks';
import { createRestSlice } from './rest';
import { RootState } from './store';

export const { slice, extraReducers } = createRestSlice({
  name: 'packs',
  api: packApi,
});

export const { fetchAll: loadPacks } = extraReducers;
export const selectPacks = (state: RootState) => state.packs;
export const usePacks = (): AsyncState<Pack[]> => useAppSelector(selectPacks);

export default slice.reducer;
