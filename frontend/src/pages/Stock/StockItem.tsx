import { FC } from 'react';
import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { qrCodeOutline, qrCodeSharp } from 'ionicons/icons';

import { Base58 } from '~/utils/base58';
import { removeDecimalZeros } from '~/utils/math';
import ListItem, { ListItemButton } from '~/components/ListItem';
import { Product } from '~/types/Product';
import classes from './Stock.module.scss';

const base58 = new Base58();

export interface BasketListProps {
  product: Product;
  onQrCodeButtonClick: (product: Product) => void;
  onEditButtonClick: (product: Product) => void;
}

const BasketList: FC<BasketListProps> = ({ product, onQrCodeButtonClick /*onEditButtonClick*/ }) => {
  const customButtons: ListItemButton[] = [
    {
      id: 'qr-code',
      label: 'Voir le QRcode',
      iosIcon: qrCodeOutline,
      mdIcon: qrCodeSharp,
      onClick: () => onQrCodeButtonClick(product),
      color: 'secondary',
    },
  ];

  return (
    <IonCard>
      <ListItem
        card={true}
        // onClickEditButton={onEditButtonClick.bind(this, product)}
        customButtons={customButtons}
      >
        <IonCardHeader>
          <IonCardTitle className={classes.item_title}>
            <span className={classes.text}>{product.name}</span>
            <IonBadge>#P{base58.encode(product.id)}</IonBadge>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className={classes.item}>
            <p>Prix de vente {removeDecimalZeros(product.sell_price)}€</p>
            <p>Prix d&apos;achat {removeDecimalZeros(product.buy_price)}€</p>
            <p>Quantité en stock : {product.quantity}</p>
          </div>
        </IonCardContent>
      </ListItem>
    </IonCard>
  );
};

export default BasketList;
