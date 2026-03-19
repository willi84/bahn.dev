import { DATA_MAP, DATA_ITEMS } from '../endpoints.d';

const error = 'fallback';
export const FALLBACK_LIST: DATA_ITEMS<any> = { total: 0, items: [], error };
export const FALLBACK_MAP: DATA_MAP<any> = { total: 0, itemsById: {}, error };

export const ID = '__id__';
export const KEY = '__key__';
export const PROP = '__prop__';
export const PROPS = '__props__';
