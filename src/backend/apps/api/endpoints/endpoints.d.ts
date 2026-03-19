import { HTTP_OPTS } from '../../../_shared/http/http';

export type FILE_ITEM = {
    key: string;
    path: string;
    api: string;
};

export type DATA_MODE = 'live' | 'cache' | 'demo';

export type REQUEST_PARAMS = {
    provider: string;
    state: string;
    limit: number;
    iteration: number;
};

export type DATA_CONFIG = {
    totalKey: string;
    itemsKey: string;
    baseEndpoint: string;
    idKey?: string;
};
// export type DATA_ENTRY = {
//     [key: string]: any;
// };

// export type DATA_ITEMS = {
//     items: DATA_ENTRY[];
//     total: number;
// };

export type DATA_ENTRY<T> = {
    [key: string]: T;
};

export type DATA_ITEMS<T> = {
    items: T[];
    total: number;
    error?: string;
};

export type DATA_MAP<T> = {
    // itemsById: {
    //     [key: string]: T;
    // };
    itemsById: DATA_ENTRY<T>;
    total: number;
    error?: string;
};

export type DATA_TYPES<T> = DATA_ITEMS<T> | DATA_MAP<T>;

export type DATA_TYPE = 'items' | 'map';
export type ENDPOINT_DATA = {
    key: string;
    // provider: string;
    tmpl: string;
    states?: string[];
    test_api: string;
    opts: HTTP_OPTS;
};
export type TARGET_CONFIG = {
    target: string;
    opts: HTTP_OPTS;
    data_config: DATA_CONFIG;
};

export type SAMPLE_DATA = { id: number };
