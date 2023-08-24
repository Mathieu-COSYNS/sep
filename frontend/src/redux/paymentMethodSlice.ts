import { paymentMethodAPI } from '~/api/paymentMethodAPI';
import { PaymentMethod } from '~/types/PaymentMethod';
import { AsyncState } from '../types/AsyncState';
import { useAppSelector } from './hooks';
import { createRestSlice } from './rest';
import { RootState } from './store';

export const { slice, extraReducers } = createRestSlice({
  name: 'paymentMethods',
  api: paymentMethodAPI,
});

export const { fetchAll: loadPaymentMethods } = extraReducers;
export const selectPaymentMethods = (state: RootState) => state.paymentMethods;
export const usePaymentMethods = (): AsyncState<PaymentMethod[]> => useAppSelector(selectPaymentMethods);

export default slice.reducer;
