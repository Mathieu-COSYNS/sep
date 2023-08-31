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
  addProduct: (product: EditableSaleItem['product'], quantity?: EditableSaleItem['quantity']) => void;
  setProduct: (product: EditableSaleItem['product'], quantity: EditableSaleItem['quantity']) => void;
  setPaymentMethod: (payment_method: PaymentMethod) => void;
}

const initSale = () => ({ total: '0', items: {} });

const calculateTotal = (sale: EditableSale) => {
  return `${
    Object.values(sale.items).reduce((acc, item) => acc + item.quantity * (+item.product.sell_price * 1000), 0) / 1000
  }`;
};

const setProductQuantity = (
  sale: EditableSale,
  product: EditableSaleItem['product'],
  quantity: EditableSaleItem['quantity'],
) => {
  const items = { ...sale.items };
  if (quantity > 0) items[product.id] = { product, quantity };
  else delete items[product.id];

  const newSale = { ...sale, items };
  return { ...newSale, total: calculateTotal(newSale) };
};

const addProductQuantity = (
  sale: EditableSale,
  product: EditableSaleItem['product'],
  quantity: EditableSaleItem['quantity'],
) => {
  const oldQuantity = sale.items[product.id]?.quantity ?? 0;
  return setProductQuantity(sale, product, oldQuantity + quantity);
};

export const useBasketStore = create<BasketStore>()(
  devtools(
    (set) => ({
      initialBasket: initSale(),
      basket: initSale(),
      loadSale: (sale) =>
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
      addProduct: (product, quantity = 1) =>
        set(({ basket: sale }) => ({ basket: addProductQuantity(sale, product, quantity) }), false, 'addProduct'),
      setProduct: (product, quantity) =>
        set(({ basket: sale }) => ({ basket: setProductQuantity(sale, product, quantity) }), false, 'setProduct'),
      setPaymentMethod: (payment_method) =>
        set(({ basket: sale }) => ({ basket: { ...sale, payment_method } }), false, 'setPaymentMethod'),
    }),
    { name: 'Basket Store' },
  ),
);

export const useIsBasketDirty = () => {
  const isDirty = useBasketStore((state) => !isEqual(state.initialBasket, state.basket));

  return isDirty;
};
