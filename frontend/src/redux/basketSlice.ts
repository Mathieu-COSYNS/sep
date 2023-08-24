import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { packApi } from '~/api/packAPI';
import { productApi } from '~/api/productAPI';
import { saleApi } from '~/api/saleAPI';
import { isEqual } from 'lodash';
import { Id } from '~/types/Id';
import { Pack } from '~/types/Pack';
import { PaymentMethod } from '~/types/PaymentMethod';
import { Product } from '~/types/Product';
import { EditableSale, Sale } from '~/types/Sale';
import { SaleItem } from '~/types/SaleItem';
import { AsyncState } from '../types/AsyncState';
import { useAppSelector } from './hooks';
import { saveSale } from './salesSlice';
import { RootState } from './store';
import { addAsyncThunk } from './utils';

type BasketState = AsyncState<{ initial?: Sale; editable: EditableSale; saved: boolean }>;

const initialState: BasketState = {
  isLoading: false,
};

const newSale: BasketState['data'] = { editable: { total: '0', items: [] }, saved: false };

export const loadSaleIntoBasket = createAsyncThunk(
  'basket/loadSale',
  async ({ id }: { id: Id }, { rejectWithValue }) => {
    try {
      const sale = await saleApi.fetchById(id);
      // The value we return becomes the `fulfilled` action payload
      return { initial: sale, editable: sale };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const addOneProductById = createAsyncThunk(
  'basket/addOneProductById',
  async (id: Product['id'], { rejectWithValue }) => {
    try {
      const product = await productApi.fetchById(id);
      return product;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.basket.isLoading || state.basket.data === undefined) {
        return false;
      }
    },
    dispatchConditionRejection: true,
  },
);

export const addProductsByPackId = createAsyncThunk(
  'basket/addProductsByPackId',
  async (id: Pack['id'], { rejectWithValue }) => {
    try {
      const pack = await packApi.fetchById(id);
      return pack;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      if (state.basket.isLoading || state.basket.data === undefined) {
        return false;
      }
    },
    dispatchConditionRejection: true,
  },
);

export const saveBasket = createAsyncThunk(
  'basket/save',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const basketSaleToSave = (getState() as RootState).basket.data?.editable;
      await dispatch(saveSale({ data: basketSaleToSave }));
      return true;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      return isBasketDirty(state.basket);
    },
    dispatchConditionRejection: true,
  },
);

const updateTotal = (sale: EditableSale) => {
  sale.total = `${sale.items.reduce((acc, item) => acc + item.quantity * +item.product.sell_price, 0)}`;
};

const updateItemsToAddProduct = (sale: EditableSale, product: Product) => {
  if (sale.items.find((item) => item.product.id == product.id)) {
    sale.items = sale.items.map((item) =>
      item.product.id === product.id ? { product, quantity: item.quantity + 1 } : item,
    );
  } else {
    sale.items.push({ product, quantity: 1 });
  }
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    removeItemByProductId: (state, action: PayloadAction<SaleItem['product']['id']>) => {
      if (state.isLoading || state.data === undefined) {
        throw new Error('Can not remove products into the basket: Basket is loading');
      }
      state.data.editable.items = state.data.editable.items.filter((item) => item.product.id !== action.payload);
      updateTotal(state.data.editable);
    },
    // addOneProduct: (state, action: PayloadAction<SaleItem['product']>) => {
    //   if (state.isLoading || state.data === undefined) {
    //     throw new Error('Can not add products into the basket: Basket is loading');
    //   }
    //   if (state.data.editable.items.find((item) => item.product.id == action.payload.id)) {
    //     state.data.editable.items = state.data.editable.items.map((item) =>
    //       item.product.id === action.payload.id ? { product: action.payload, quantity: item.quantity + 1 } : item
    //     );
    //   } else {
    //     state.data.editable.items.push({ product: action.payload, quantity: 1 });
    //   }
    //   updateTotal(state.data.editable);
    // },
    updateProductQuantity: (state, action: PayloadAction<{ productId: Product['id']; quantity: number }>) => {
      if (state.isLoading || state.data === undefined) {
        throw new Error('Can not update quantity: Basket is loading');
      }
      state.data.editable.items = state.data.editable.items
        .map((item) =>
          item.product.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item,
        )
        .filter((item) => item.quantity > 0);
      updateTotal(state.data.editable);
    },
    removeOneProductById: (state, action: PayloadAction<Product['id']>) => {
      if (state.isLoading || state.data === undefined) {
        throw new Error('Can not remove products into the basket: Basket is loading');
      }
      state.data.editable.items = state.data.editable.items
        .map((item) => (item.product.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);
      updateTotal(state.data.editable);
    },
    initializeNewSale: () => {
      return { isLoading: false, data: newSale, error: undefined };
    },
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      if (state.isLoading || state.data === undefined) {
        throw new Error('Can not remove products into the basket: Basket is loading');
      }
      state.data.editable.payment_method = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncThunk(builder, loadSaleIntoBasket);
    builder.addCase(addOneProductById.fulfilled, (state, action) => {
      if (!state.data) return;
      const product = action.payload;
      if (typeof product === 'undefined') return;

      updateItemsToAddProduct(state.data.editable, product);
      updateTotal(state.data.editable);

      state.isLoading = false;
      state.error = undefined;
    });
    builder.addCase(addProductsByPackId.fulfilled, (state, action) => {
      if (!state.data) return;
      const pack = action.payload;
      if (typeof pack === 'undefined') return;

      for (const product of pack.products) {
        updateItemsToAddProduct(state.data.editable, product);
      }
      updateTotal(state.data.editable);

      state.isLoading = false;
      state.error = undefined;
    });
  },
});

export const {
  updateProductQuantity,
  removeItemByProductId,
  removeOneProductById,
  initializeNewSale,
  setPaymentMethod,
} = basketSlice.actions;

export const selectBasket = (state: RootState): BasketState => state.basket;
export const useBasket = (): BasketState => useAppSelector(selectBasket);

export const isBasketDirty = (basket: BasketState): boolean => {
  if (basket.isLoading || basket.data === undefined) return false;
  if (basket.data.initial === undefined && isEqual(basket.data.editable, newSale.editable)) return false;
  return !isEqual(basket.data?.initial, basket.data?.editable);
};

export const useIsBasketDirty = (): boolean => {
  const basket = useAppSelector(selectBasket);
  return isBasketDirty(basket);
};

export default basketSlice.reducer;
