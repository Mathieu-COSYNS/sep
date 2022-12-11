import { AsyncState } from '../types/AsyncState';
import { RootState } from './store';
import { useAppSelector } from './hooks';
import { PaymentMethod } from '@/types/PaymentMethod';
import { paymentMethodAPI } from '@/api/paymentMethodAPI';
import { createRestSlice } from './rest';

export const { slice, extraReducers } = createRestSlice({
  name: 'paymentMethods',
  api: paymentMethodAPI,
});

export const { fetchAll: loadPaymentMethods } = extraReducers;
export const selectPaymentMethods = (state: RootState) => state.paymentMethods;
export const usePaymentMethods = (): AsyncState<PaymentMethod[]> => useAppSelector(selectPaymentMethods);

export default slice.reducer;
