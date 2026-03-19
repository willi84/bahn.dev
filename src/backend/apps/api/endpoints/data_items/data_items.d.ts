import { DATA_CONFIG, ENDPOINT_DATA } from '../endpoints.d';
import { DATA_MAP, DATA_ITEMS } from '../endpoints.d';
import { SAMPLE_DATA } from '../endpoints.d';
import { Json } from '../../../../index.d';

export type ENDPOINT_CONFIG = {
    endpoint: ENDPOINT_DATA;
    data_config: DATA_CONFIG;
};
export type MOCK_DATA = {
    live: Json;
    demo: Json;
    cache: Json;
    fallback: Json;
};
export type SAMPLE_MAP = DATA_MAP<SAMPLE_DATA>;
export type SAMPLE_LIST = DATA_ITEMS<SAMPLE_DATA>;

export type UPDATE_ITEM = {
    item: any;
    key: string;
    idKey: string;
};
