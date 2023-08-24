import { IonAlert } from '@ionic/react';
import { useEffect, FC, useState } from 'react';
import { setPaymentMethod, useBasket } from '~/redux/basketSlice';
import { useAppDispatch } from '~/redux/hooks';
import { usePaymentMethods } from '~/redux/paymentMethodSlice';

export interface PaymentPromptProps {
  open: boolean;
  onDidDismiss?: () => void;
  onDidFinish: () => void;
}

const PaymentPrompt: FC<PaymentPromptProps> = ({ open, onDidDismiss, onDidFinish }) => {
  const [closing, setClosing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const paymentMethods = usePaymentMethods();
  const basket = useBasket();

  const autoSelectPayment =
    !paymentMethods.isLoading && paymentMethods.data?.length == 1 ? paymentMethods.data[0] : undefined;

  useEffect(() => {
    if (open && autoSelectPayment) {
      if (basket.data?.editable.payment_method?.id === autoSelectPayment.id) {
        onDidFinish();
      } else {
        dispatch(setPaymentMethod(autoSelectPayment));
      }
    }
  }, [open, autoSelectPayment, dispatch, onDidFinish, basket.data?.editable.payment_method?.id]);

  useEffect(() => {
    if (closing && open) onDidFinish();
  }, [open, closing, onDidFinish]);

  return (
    <IonAlert
      isOpen={open && autoSelectPayment === undefined}
      onDidDismiss={onDidDismiss}
      header={'Payment'}
      subHeader={
        !paymentMethods.isLoading && paymentMethods.data ? 'Indiquez comment le client vous a payé' : 'Chargement...'
      }
      inputs={
        paymentMethods.data?.map((paymentMethod) => ({
          name: 'paymentMethod',
          type: 'radio',
          label: paymentMethod.name,
          value: paymentMethod.id,
          checked: basket.data?.editable.payment_method?.id === paymentMethod.id,
        })) ?? []
      }
      buttons={[
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Terminer',
          handler: (value) => {
            if (paymentMethods.data) {
              const paymentMethod = paymentMethods.data.find((paymentMethod) => paymentMethod.id === value);
              if (paymentMethod) {
                dispatch(setPaymentMethod(paymentMethod));
                setClosing(true);
              }
            } else {
              return false;
            }
          },
        },
      ]}
    />
  );
};

export default PaymentPrompt;
