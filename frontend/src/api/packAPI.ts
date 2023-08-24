import { Pack } from '~/types/Pack';
import { CRUDApi } from './_API';

export const packApi = new CRUDApi<Pack, Pack>('packs');
