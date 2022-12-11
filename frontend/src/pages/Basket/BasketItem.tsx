import ListItem from '@/components/ListItem';
import { FC } from 'react';
import { EditableSaleItem } from '@/types/SaleItem';
import { removeDecimalZeros } from '@/utils/math';
import classes from './Basket.module.scss';

export interface BasketListProps {
  saleItem: EditableSaleItem;
  onEditButtonClick: (saleItem: EditableSaleItem) => void;
  onRemoveButtonClick: (saleItem: EditableSaleItem) => void;
}

const BasketList: FC<BasketListProps> = ({ saleItem, onEditButtonClick, onRemoveButtonClick }) => {
  return (
    <ListItem
      onClickEditButton={onEditButtonClick.bind(this, saleItem)}
      onClickDeleteButton={onRemoveButtonClick.bind(this, saleItem)}
    >
      <div className={classes.basket_item}>
        <span>{saleItem.product.name}</span>
        <span>{removeDecimalZeros(saleItem.product.sell_price)}€</span>
        <span>x{saleItem.quantity}</span>
      </div>
    </ListItem>
  );
};

export default BasketList;
