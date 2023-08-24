import { IonItem, useIonRouter } from '@ionic/react';
import Page from '~/components/Page';
import StateAwareList from '~/components/StateAwareList';
import { useEffect, FC } from 'react';
import { useAppDispatch } from '~/redux/hooks';
import { loadProducts, useProducts } from '~/redux/productsSlice';
import { Product } from '~/types/Product';
import { Base58 } from '~/utils/base58';
import StockItem from './StockItem';
import StockLoading from './StockLoading';

const base58 = new Base58();

const Stock: FC = () => {
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
    router.push(`/qr/product/${base58.encode(product.id)}/`);
  };

  const handleRefresh = () => {
    dispatch(loadProducts());
  };

  return (
    <Page title="Stock">
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
        loadingComponent={<StockLoading />}
        emptyComponent={'Aucun Produit'}
        renderError={(error) => <IonItem>Error: {JSON.stringify(error, undefined, 2)}</IonItem>}
        onRefresh={handleRefresh}
      />
    </Page>
  );
};

export default Stock;
