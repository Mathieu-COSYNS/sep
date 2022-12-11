import { Entry } from '@/types/Entry';
import { CRUDApi } from './_API';

export const entriesApi = new CRUDApi<Entry, Entry>('entries');
