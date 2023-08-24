import { entriesApi } from '~/api/entriesAPI';
import { Entry } from '~/types/Entry';
import { AsyncState } from '../types/AsyncState';
import { useAppSelector } from './hooks';
import { createRestSlice } from './rest';
import { RootState } from './store';

export const { slice, extraReducers } = createRestSlice({
  name: 'entries',
  api: entriesApi,
});

export const { fetchAll: loadEntries } = extraReducers;
export const selectEntries = (state: RootState) => state.entries;
export const useEntries = (): AsyncState<Entry[]> => useAppSelector(selectEntries);

export default slice.reducer;
