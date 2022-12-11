import { Product } from '@/types/Product';
import { CRUDApi } from './_API';

export const productApi = new CRUDApi<Product, Product>('products');
