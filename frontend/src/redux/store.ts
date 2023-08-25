import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import basketReducer from './basketSlice';
import salesReducer from './salesSlice';

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    sales: salesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
