import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { AsyncState } from './AsyncState';

export const addAsyncThunk = <State extends AsyncState<unknown>, ThunkResult>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<ThunkResult, void, Record<string, never>>
): void => {
  builder
    .addCase(thunk.pending, (state) => {
      state.isLoading = true;
      state.data = undefined;
      state.error = undefined;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = undefined;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.isLoading = false;
      state.data = undefined;
      state.error = action.error;
    });
};
