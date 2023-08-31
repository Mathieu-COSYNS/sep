import { FC } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';

import { removeDecimalZeros } from '~/utils/math';
import { Counter } from '~/components/Counter';
import ListItem from '~/components/ListItem';
import { useBasketStore } from '~/store/basketStore';
import { EditableSaleItem } from '~/types/SaleItem';
import classes from './Basket.module.scss';

export interface BasketListProps {
  saleItem: EditableSaleItem;
}

const BasketList: FC<BasketListProps> = ({ saleItem }) => {
  const { setProduct, addProduct } = useBasketStore();
  const price = removeDecimalZeros(saleItem.product.sell_price);
  return (
    <IonCard>
      <ListItem card={true}>
        <IonCardHeader>
          <IonCardTitle className={classes.basket_item_title}>{saleItem.product.name}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className={classes.basket_item_content}>
            <span className={classes.price}>Prix unitaire: {price}€</span>
            <Counter
              value={saleItem.quantity}
              setValue={(value) => setProduct(saleItem.product, value)}
              increaseValue={() => addProduct(saleItem.product)}
              decreaseValue={() => addProduct(saleItem.product, -1)}
              label={`Quantité de ${saleItem.product.name}`}
              min={1}
              deleteIfDecreaseBeyondMin={true}
            />
          </div>
        </IonCardContent>
      </ListItem>
    </IonCard>
  );
};

export default BasketList;
