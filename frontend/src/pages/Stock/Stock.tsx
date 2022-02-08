import { IonItem, useIonRouter } from '@ionic/react';
import Page from 'components/Page';
import StateAwareList from 'components/StateAwareList';
import { useEffect, VFC } from 'react';
import { useAppDispatch } from 'redux/hooks';
import { loadProducts, useProducts } from 'redux/productsSlice';
import { Product } from 'types/Product';
import { Base58 } from 'utils/base58';
import StockItem from './StockItem';
import StockLoading from './StockLoading';

const base58 = new Base58();

const Stock: VFC = () => {
  const router = useIonRouter();
  const products = useProducts();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  const handleEditButtonClick = (product: Product) => {
    console.log('edit', product);
  };

  const handleQrCodeButtonClick = (product: Product) => {
    router.push(`/qr/product/${base58.encode(product.id)}`);
  };

  const handleRefresh = () => {
    dispatch(loadProducts());
  };

  return (
    <Page title="Stock">
      {/* <IonItem>
        <IonLabel>Trier par</IonLabel>
        <IonSelect interface="popover" placeholder="Select One" onIonChange={(e) => console.log(e.detail.value)}>
          <IonSelectOption value="female">Female</IonSelectOption>
          <IonSelectOption value="male">Male</IonSelectOption>
        </IonSelect>
      </IonItem> */}
      <StateAwareList
        state={{ isLoading: products.isLoading, items: products.data, error: products.error }}
        renderItem={(product) => (
          <StockItem
            product={product}
            onQrCodeButtonClick={handleQrCodeButtonClick}
            onEditButtonClick={handleEditButtonClick}
          />
        )}
        keyResolver={(product) => `${product.id}`}
        toolbarButtons={
          [
            // <IonButton key="1" fill="clear" shape="round">
            //   <IonIcon slot="start" ios={addOutline} md={addSharp} />
            //   Nouveau produit
            // </IonButton>,
          ]
        }
        loadingComponent={<StockLoading />}
        emptyComponent={'Aucun Produit'}
        renderError={(error) => <IonItem>Error: {JSON.stringify(error, undefined, 2)}</IonItem>}
        onRefresh={handleRefresh}
      />
    </Page>
  );
};

export default Stock;
