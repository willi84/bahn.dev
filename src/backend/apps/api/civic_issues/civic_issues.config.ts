import { DEFAULT_HTTP_OPTS } from '../../../_shared/http/http.config';
import { ENDPOINT_CONFIG } from '../endpoints/data_items/data_items.d';
import { ENDPOINT_DATA, DATA_CONFIG } from '../endpoints/endpoints.d';

export const CIVIC_STATES = ['OPEN', 'CLOSED', 'NOT_RESPONSIBLE', 'IN_PROCESS'];

export const PROVIDER =
    'https://mitgestalten.potsdam.de/backend/v1/flaw-reporter';
// export const PROVIDER_CIVIC_ISSUES =
//     'https://mitgestalten.potsdam.de/backend/v1/flaw-reporter';

export const ENDPOINT = 'findPageableReportsWithFilter?flawReporterId=3';

export const ENDPOINT_URL = `${PROVIDER}/${ENDPOINT}`;
export const TMPL_CIVIC_ISSUES = `${ENDPOINT_URL}&filteredStates={STATE}&limit={LIMIT}&offset={OFFSET}`;

export const CONFIG_CIVIC_ISSUES_DATA: DATA_CONFIG = {
    baseEndpoint: '',
    totalKey: 'totalCnt',
    itemsKey: 'reports',
    idKey: 'id',
};

export const ENDPOINT_CIVIC_ISSUES: ENDPOINT_DATA = {
    // provider: PROVIDER,
    tmpl: `${TMPL_CIVIC_ISSUES}`,
    states: CIVIC_STATES,
    key: 'civic_issues',
    test_api: `${ENDPOINT_URL}&limit=1&offset=0`,
    opts: DEFAULT_HTTP_OPTS,
};
export const ENDPOINT_CONFIG_CIVIC_ISSUES: ENDPOINT_CONFIG = {
    endpoint: ENDPOINT_CIVIC_ISSUES,
    data_config: CONFIG_CIVIC_ISSUES_DATA,
};
