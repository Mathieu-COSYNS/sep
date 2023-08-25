import { Id } from '~/types/Id';
import { packApi } from './packAPI';
import { productApi } from './productAPI';

export const fetchQrCode = async ({ type, id }: { type: 'product' | 'pack'; id: Id }) => {
  if (type === 'product') {
    const response = await productApi.fetchById(id);
    return { type, value: response };
  }
  if (type === 'pack') {
    const response = await packApi.fetchById(id);
    return { type, value: response };
  }
};
