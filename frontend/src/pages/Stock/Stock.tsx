import { FC } from 'react';
import { useIonRouter } from '@ionic/react';

import { Base58 } from '~/utils/base58';
import { productApi } from '~/api/productAPI';
import Page from '~/components/Page';
import { ReactQueryStateAwareList } from '~/components/ReactQueryStateAwareList';
import { Product } from '~/types/Product';
import StockItem from './StockItem';
import StockLoading from './StockLoading';

const base58 = new Base58();

const Stock: FC = () => {
  const router = useIonRouter();

  const handleEditButtonClick = (product: Product) => {
    console.log('edit', product);
  };

  const handleQrCodeButtonClick = (product: Product) => {
    router.push(`/qr/product/${base58.encode(product.id)}/`);
  };

  return (
    <Page title="Stock">
      <ReactQueryStateAwareList
        reactQueryOptions={{ queryKey: ['products/all'], queryFn: productApi.fetchAll }}
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
      />
    </Page>
  );
};

export default Stock;
