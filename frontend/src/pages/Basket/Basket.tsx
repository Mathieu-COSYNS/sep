import { FC, useState } from 'react';
import { useToast } from '@agney/ir-toast';
import { IonButton, IonIcon, useIonLoading, useIonRouter } from '@ionic/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { qrCodeOutline, qrCodeSharp } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';

import { serializeError } from '~/utils/errors';
import { saleApi } from '~/api/saleAPI';
import Page from '~/components/Page';
import StateAwareList from '~/components/StateAwareList';
import { useIdParam } from '~/hooks/useIdParam';
import { useBasketStore, useIsBasketDirty } from '~/store/basketStore';
import classes from './Basket.module.scss';
import BasketItem from './BasketItem';
import BasketLoading from './BasketLoading';
import PaymentPrompt from './PaymentPrompt';

const Basket: FC = () => {
  const { url } = useRouteMatch();
  const id = useIdParam();
  const [showPaymentPrompt, setShowPaymentPrompt] = useState<boolean>(false);
  const [present, dismiss] = useIonLoading();
  const Toast = useToast();
  const router = useIonRouter();

  const { data } = useQuery({
    queryKey: ['sale', id],
    queryFn: async () => (id ? saleApi.fetchById(id) : null),
  });
  const { basket, loadSale } = useBasketStore();
  const isBasketDirty = useIsBasketDirty();

  const saveBasketMutation = useMutation({ mutationFn: saleApi.save });

  const handleSaveButtonClick = () => {
    setShowPaymentPrompt(true);
  };

  const handlePaymentPromptDismiss = () => {
    setShowPaymentPrompt(false);
  };

  const handlePaymentPromptFinish = async () => {
    if (isBasketDirty) {
      await present({ message: 'Enregistrement...' });
      setShowPaymentPrompt(false);
      try {
        saveBasketMutation.mutate(basket, {
          onSuccess: (data) => {
            if (data) loadSale(data);
          },
        });
        await dismiss();
        router.push('/ventes/');
      } catch (e) {
        await dismiss();
        Toast.error(serializeError(e));
      }
    } else {
      router.push('/ventes/');
    }
  };

  return (
    <Page
      title={id ? `Modifier la Vente ${id}` : 'Nouvelle vente'}
      backButton={true}
      defaultBackUrl={'/ventes/'}
      backText={'Ventes'}
    >
      <div className={classes.basket}>
        <StateAwareList
          state={{
            isLoading: (data?.id ?? null) !== id,
            items: Object.values(basket.items),
            error: (data?.id ?? null) !== id ? 'Impossible de le panier' : undefined,
          }}
          renderItem={(saleItem) => <BasketItem saleItem={saleItem} />}
          keyResolver={(saleItem) => `${saleItem.product.id}`}
          loadingComponent={<BasketLoading />}
          emptyComponent={'Le panier est vide'}
          toolbarText={`Total: ${basket.total}€`}
          toolbarButtons={[
            <IonButton routerLink={`${url}scanner/`} key="1" fill="clear" shape="round">
              <IonIcon slot="start" ios={qrCodeOutline} md={qrCodeSharp} aria-hidden />
              Scan un QR Code
            </IonButton>,
          ]}
        />
        <div className={classes.save_btn}>
          <IonButton expand="block" onClick={handleSaveButtonClick} disabled={Object.keys(basket.items).length === 0}>
            Sauvegarder
          </IonButton>
        </div>
      </div>
      <PaymentPrompt
        open={showPaymentPrompt}
        onDidDismiss={handlePaymentPromptDismiss}
        onDidFinish={handlePaymentPromptFinish}
      />
    </Page>
  );
};

export default Basket;
