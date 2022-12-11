import { PaymentMethod } from '@/types/PaymentMethod';
import { ReadApi } from './_API';

export const paymentMethodAPI = new ReadApi<PaymentMethod>('payment-methods');
