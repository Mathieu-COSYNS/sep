import { BaseEditableObject } from './BaseEditableObject';
import { BaseObject } from './BaseObject';
import { Id } from './Id';
import { PaymentMethod } from './PaymentMethod';
import { EditableSaleItem, SaleItem } from './SaleItem';

export interface EditableSale extends BaseEditableObject {
  created_date?: string;
  updated_date?: string | null;
  payment_method?: PaymentMethod;
  total: string;
  items: Record<Id, EditableSaleItem>;
}

export interface Sale extends Omit<EditableSale, 'id'>, BaseObject {
  created_date: string;
  updated_date: string | null;
  payment_method: PaymentMethod;
  items: SaleItem[];
}
