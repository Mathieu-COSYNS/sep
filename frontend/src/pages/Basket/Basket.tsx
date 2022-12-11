import { IonButton, IonFab, IonFabButton, IonIcon, IonItem, useIonLoading, useIonRouter } from '@ionic/react';
import Page from '@/components/Page';
import { qrCodeOutline, qrCodeSharp } from 'ionicons/icons';
import { useEffect, useState, FC } from 'react';
import { initializeNewSale, saveBasket, useBasket, useIsBasketDirty } from '@/redux/basketSlice';
import { useAppDispatch } from '@/redux/hooks';
import BasketLoading from './BasketLoading';
import BasketRemoveItem from './BasketRemoveItem';
import classes from './Basket.module.scss';
import StateAwareList from '@/components/StateAwareList';
import BasketItem from './BasketItem';
import { EditableSaleItem } from '@/types/SaleItem';
import { removeDecimalZeros } from '@/utils/math';
import PaymentPrompt from './PaymentPrompt';
import { loadPaymentMethods } from '@/redux/paymentMethodSlice';
import BasketEditItem from './BasketEditItem';
import { useToast } from '@agney/ir-toast';

const Basket: FC = () => {
  const [editSaleItem, setEditSaleItem] = useState<EditableSaleItem | undefined>();
  const [removeSaleItem, setRemoveSaleItem] = useState<EditableSaleItem | undefined>();
  const [showPaymentPrompt, setShowPaymentPrompt] = useState<boolean>(false);
  const [present, dismiss] = useIonLoading();
  const Toast = useToast();
  const router = useIonRouter();

  const basket = useBasket();
  const isBasketDirty = useIsBasketDirty();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (!basket.isLoading && !basket.data) dispatch(initializeNewSale());
  }, [basket, dispatch]);

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

  const handlePaymentPromptFinish = () => {
    if (isBasketDirty) {
      present({ message: 'Enregistrement...' });
      setShowPaymentPrompt(false);
      dispatch(saveBasket())
        .then(async () => {
          dispatch(initializeNewSale());
          await dismiss();
          router.push('/ventes/');
        })
        .catch(async (reason) => {
          await dismiss();
          Toast.error(reason.toString());
        });
    } else {
      router.push('/ventes/');
    }
  };

  return (
    <Page title="Pannier">
      <div className={classes.basket}>
        <p>Total: {removeDecimalZeros(basket.data?.editable.total || '0')}€</p>
        <StateAwareList
          state={{ isLoading: basket.isLoading, items: basket.data?.editable.items, error: basket.error }}
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
          <IonButton
            expand="block"
            onClick={handleSaveButtonClick}
            disabled={!basket.data || basket.data.editable.items.length === 0}
          >
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
        <IonFabButton routerLink="/ventes/scanner/">
          <IonIcon ios={qrCodeOutline} md={qrCodeSharp} />
        </IonFabButton>
      </IonFab>
    </Page>
  );
};

export default Basket;
