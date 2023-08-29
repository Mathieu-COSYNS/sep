import { FC } from 'react';
import { IonAlert } from '@ionic/react';

import { useBasketStore } from '~/store/basketStore';
import { EditableSaleItem } from '~/types/SaleItem';

export interface BasketRemoveItemProps {
  saleItem?: EditableSaleItem;
  onDidDismiss?: () => void;
}

const BasketRemoveItem: FC<BasketRemoveItemProps> = ({ saleItem, onDidDismiss }) => {
  const { setProduct } = useBasketStore();

  return (
    <IonAlert
      isOpen={!!saleItem}
      onDidDismiss={onDidDismiss}
      header={`Modifier ${saleItem?.product.name}`}
      message={'Inscrivez la nouvelle quantité'}
      inputs={[
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'XXXX',
          value: `${saleItem?.quantity}`,
          min: 1,
        },
      ]}
      buttons={[
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          handler: (value) => {
            const quantity = parseInt(value.quantity);
            if (Number.isNaN(quantity)) return false;
            if (saleItem?.product.id) {
              setProduct({ product: saleItem.product, quantity });
            }
          },
        },
      ]}
    />
  );
};

export default BasketRemoveItem;
