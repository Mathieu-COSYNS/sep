import { FC } from 'react';
import { AlertButton, IonAlert } from '@ionic/react';

import { useBasketStore } from '~/store/basketStore';
import { EditableSaleItem } from '~/types/SaleItem';

export interface BasketRemoveItemProps {
  saleItem?: EditableSaleItem;
  onDidDismiss?: () => void;
}

const BasketRemoveItem: FC<BasketRemoveItemProps> = ({ saleItem, onDidDismiss }) => {
  const { addProduct, removeProduct } = useBasketStore();
  const buttons: (string | AlertButton)[] = [];

  if (saleItem) {
    if (saleItem?.quantity > 1) {
      buttons.push({
        text: 'Supprimer 1 fois',
        role: 'destructive',
        handler: () => {
          if (saleItem) {
            addProduct({ quantity: -1, product: saleItem.product });
          }
        },
      });
    }

    buttons.push(
      {
        text: `Supprimer ${saleItem?.quantity ? `${saleItem.quantity} fois` : ''}`,
        role: 'destructive',
        handler: () => {
          if (saleItem) {
            removeProduct(saleItem.product);
          }
        },
      },
      {
        text: 'Annuler',
        role: 'cancel',
      },
    );
  }

  return (
    <IonAlert
      isOpen={!!saleItem}
      onDidDismiss={onDidDismiss}
      header={`Supprimer ${saleItem?.product.name} ?`}
      message={`Il y a ${saleItem?.quantity} fois "${saleItem?.product.name}" dans le pannier`}
      buttons={buttons}
    />
  );
};

export default BasketRemoveItem;
