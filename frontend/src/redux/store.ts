import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import bannerReducer from './bannerSlice';
import basketReducer from './basketSlice';
import entriesReducer from './entriesSlice';
import packsReducer from './packsSlice';
import paymentMethodReducer from './paymentMethodSlice';
import productsReducer from './productsSlice';
import qrCodeReducer from './qrCodeSlice';
import salesReducer from './salesSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    banner: bannerReducer,
    basket: basketReducer,
    user: userReducer,
    entries: entriesReducer,
    products: productsReducer,
    packs: packsReducer,
    sales: salesReducer,
    qrCode: qrCodeReducer,
    paymentMethods: paymentMethodReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
