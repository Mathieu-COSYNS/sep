import { isEqual } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { PaymentMethod } from '~/types/PaymentMethod';
import { EditableSale, Sale } from '~/types/Sale';
import { EditableSaleItem } from '~/types/SaleItem';

interface BasketStore {
  initialBasket: EditableSale;
  basket: EditableSale;
  loadSale: (sale: Sale) => void;
  reset: () => void;
  addProduct: (item: EditableSaleItem) => void;
  setProduct: (item: EditableSaleItem) => void;
  removeProduct: (product: EditableSaleItem['product']) => void;
  setPaymentMethod: (payment_method: PaymentMethod) => void;
}

const initSale = () => ({ total: '0', items: {} });

const calculateTotal = (sale: EditableSale) => {
  return `${
    Object.values(sale.items).reduce((acc, item) => acc + item.quantity * (+item.product.sell_price * 1000), 0) / 1000
  }`;
};

const setItemQuantity = (sale: EditableSale, item: EditableSaleItem) => {
  const items = { ...sale.items };
  if (item.quantity > 0) items[item.product.id] = item;
  else delete items[item.product.id];
  const newSale = { ...sale, items };
  return { ...newSale, total: calculateTotal(newSale) };
};

const addItemQuantity = (sale: EditableSale, item: EditableSaleItem) => {
  const quantity = sale.items[item.product.id]?.quantity ?? 0;
  return setItemQuantity(sale, { ...item, quantity: item.quantity + quantity });
};

export const useBasketStore = create<BasketStore>()(
  devtools(
    (set) => ({
      initialBasket: initSale(),
      basket: initSale(),
      loadSale: (sale: Sale) =>
        set(
          () => {
            const formattedItems: EditableSale['items'] = {};
            for (const item of sale.items) {
              formattedItems[item.product.id] = item;
            }
            const formattedSale = {
              id: sale.id,
              payment_method: sale.payment_method,
              items: formattedItems,
              total: calculateTotal(sale),
            };
            return { initialBasket: formattedSale, basket: formattedSale };
          },
          false,
          'loadSale',
        ),
      reset: () =>
        set(
          () => {
            const sale = initSale();
            return { initialBasket: sale, basket: sale };
          },
          false,
          'reset',
        ),
      addProduct: (item: EditableSaleItem) =>
        set(({ basket: sale }) => ({ basket: addItemQuantity(sale, item) }), false, 'addProduct'),
      setProduct: (item: EditableSaleItem) =>
        set(({ basket: sale }) => ({ basket: setItemQuantity(sale, item) }), false, 'setProduct'),
      removeProduct: (product: EditableSaleItem['product']) =>
        set(
          ({ basket: sale }) => ({ basket: setItemQuantity(sale, { product, quantity: 0 }) }),
          false,
          'removeProduct',
        ),
      setPaymentMethod: (payment_method: PaymentMethod) =>
        set(({ basket: sale }) => ({ basket: { ...sale, payment_method } }), false, 'setPaymentMethod'),
    }),
    { name: 'Basket Store' },
  ),
);

export const useIsBasketDirty = () => {
  const isDirty = useBasketStore((state) => !isEqual(state.initialBasket, state.basket));

  return isDirty;
};
