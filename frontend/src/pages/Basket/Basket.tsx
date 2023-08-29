import { FC, useState } from 'react';
import { useToast } from '@agney/ir-toast';
import { IonButton, IonFab, IonFabButton, IonIcon, IonItem, useIonLoading, useIonRouter } from '@ionic/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { qrCodeOutline, qrCodeSharp } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';

import { serializeError } from '~/utils/errors';
import { saleApi } from '~/api/saleAPI';
import Page from '~/components/Page';
import StateAwareList from '~/components/StateAwareList';
import { useIdParam } from '~/hooks/useIdParam';
import { useBasketStore, useIsBasketDirty } from '~/store/basketStore';
import { EditableSaleItem } from '~/types/SaleItem';
import classes from './Basket.module.scss';
import BasketEditItem from './BasketEditItem';
import BasketItem from './BasketItem';
import BasketLoading from './BasketLoading';
import BasketRemoveItem from './BasketRemoveItem';
import PaymentPrompt from './PaymentPrompt';

const Basket: FC = () => {
  const { url } = useRouteMatch();
  const id = useIdParam();
  const [editSaleItem, setEditSaleItem] = useState<EditableSaleItem | undefined>();
  const [removeSaleItem, setRemoveSaleItem] = useState<EditableSaleItem | undefined>();
  const [showPaymentPrompt, setShowPaymentPrompt] = useState<boolean>(false);
  const [present, dismiss] = useIonLoading();
  const Toast = useToast();
  const router = useIonRouter();

  const { data } = useQuery(['sale', id], async () => (id ? saleApi.fetchById(id) : null));
  const { basket, loadSale } = useBasketStore();
  const isBasketDirty = useIsBasketDirty();

  const saveBasketMutation = useMutation({ mutationFn: saleApi.save });

  const handleEditItemButtonClick = (saleItem: EditableSaleItem) => {
    setEditSaleItem(saleItem);
  };

  const handleRemoveItemButtonClick = (saleItem: EditableSaleItem) => {
    setRemoveSaleItem(saleItem);
  };

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
        <p>Total: {basket.total}€</p>
        <StateAwareList
          state={{
            isLoading: (data?.id ?? null) !== id,
            items: Object.values(basket.items),
            error: (data?.id ?? null) !== id ? 'Impossible de le panier' : undefined,
          }}
          renderItem={(saleItem) => (
            <BasketItem
              saleItem={saleItem}
              onEditButtonClick={handleEditItemButtonClick.bind(this, saleItem)}
              onRemoveButtonClick={handleRemoveItemButtonClick.bind(this, saleItem)}
            />
          )}
          keyResolver={(saleItem) => `${saleItem.product.id}`}
          loadingComponent={<BasketLoading />}
          emptyComponent={'Le panier est vide'}
          renderError={(error) => <IonItem>Error: {JSON.stringify(error, undefined, 2)}</IonItem>}
        />
        <div className={classes.save_btn}>
          <IonButton expand="block" onClick={handleSaveButtonClick} disabled={Object.keys(basket.items).length === 0}>
            Sauvegarder
          </IonButton>
        </div>
      </div>
      <BasketEditItem saleItem={editSaleItem} onDidDismiss={() => setEditSaleItem(undefined)} />
      <BasketRemoveItem saleItem={removeSaleItem} onDidDismiss={() => setRemoveSaleItem(undefined)} />
      <PaymentPrompt
        open={showPaymentPrompt}
        onDidDismiss={handlePaymentPromptDismiss}
        onDidFinish={handlePaymentPromptFinish}
      />
      <IonFab className={classes.scanner_btn} vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton routerLink={`${url}scanner/`} aria-label="Scan un QRcode">
          <IonIcon ios={qrCodeOutline} md={qrCodeSharp} aria-hidden />
        </IonFabButton>
      </IonFab>
    </Page>
  );
};

export default Basket;
