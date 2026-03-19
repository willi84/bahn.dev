import { DEFAULT_HTTP_OPTS } from '../../../../_shared/http/http.config';
import { ENDPOINT_CONFIG } from '../../endpoints/data_items/data_items.d';
import { DATA_CONFIG, ENDPOINT_DATA } from '../../endpoints/endpoints.d';

export const FAKE_API = 'FAKE.api';

const ENDPOINT_URL = `http://${FAKE_API}/sample_endpoint`;
const TMPL_SAMPLE = `${ENDPOINT_URL}`;

export const ENDPOINT_SAMPLE_LIST: ENDPOINT_DATA = {
    tmpl: `${TMPL_SAMPLE}`,
    key: 'sample_data',
    test_api: `${ENDPOINT_URL}`,
    opts: DEFAULT_HTTP_OPTS,
};

export const CONFIG_SAMPLE_DATA_LIST: DATA_CONFIG = {
    baseEndpoint: '',
    totalKey: 'total',
    itemsKey: 'items',
};
export const ENDPOINT_CONFIG_SAMPLE_LIST: ENDPOINT_CONFIG = {
    endpoint: ENDPOINT_SAMPLE_LIST,
    data_config: CONFIG_SAMPLE_DATA_LIST,
};

export const ENDPOINT_SAMPLE_MAP: ENDPOINT_DATA = {
    tmpl: `${TMPL_SAMPLE}?type=map`,
    key: 'sample_data',
    test_api: `${ENDPOINT_URL}?type=map`,
    opts: DEFAULT_HTTP_OPTS,
};
export const CONFIG_SAMPLE_DATA_MAP: DATA_CONFIG = {
    baseEndpoint: '',
    totalKey: 'total',
    itemsKey: 'itemsById',
    idKey: 'id',
};
export const ENDPOINT_CONFIG_SAMPLE_MAP: ENDPOINT_CONFIG = {
    endpoint: ENDPOINT_SAMPLE_MAP,
    data_config: CONFIG_SAMPLE_DATA_MAP,
};
