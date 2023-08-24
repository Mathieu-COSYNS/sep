import { AsyncState } from '../types/AsyncState';
import { RootState } from './store';
import { useAppSelector } from './hooks';
import { Entry } from '~/types/Entry';
import { entriesApi } from '~/api/entriesAPI';
import { createRestSlice } from './rest';

export const { slice, extraReducers } = createRestSlice({
  name: 'entries',
  api: entriesApi,
});

export const { fetchAll: loadEntries } = extraReducers;
export const selectEntries = (state: RootState) => state.entries;
export const useEntries = (): AsyncState<Entry[]> => useAppSelector(selectEntries);

export default slice.reducer;
