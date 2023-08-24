import { AlertButton, IonAlert } from '@ionic/react';
import { FC } from 'react';
import { removeOneProductById, removeItemByProductId } from '~/redux/basketSlice';
import { useAppDispatch } from '~/redux/hooks';
import { EditableSaleItem } from '~/types/SaleItem';

export interface BasketRemoveItemProps {
  saleItem?: EditableSaleItem;
  onDidDismiss?: () => void;
}

const BasketRemoveItem: FC<BasketRemoveItemProps> = ({ saleItem, onDidDismiss }) => {
  const dispatch = useAppDispatch();

  const buttons: (string | AlertButton)[] = [];

  if (saleItem) {
    if (saleItem?.quantity > 1) {
      buttons.push({
        text: 'Supprimer 1 fois',
        role: 'destructive',
        handler: () => {
          if (saleItem) {
            dispatch(removeOneProductById(saleItem.product.id));
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
            dispatch(removeItemByProductId(saleItem.product.id));
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
