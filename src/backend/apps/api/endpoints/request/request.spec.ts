import { clone, substitute } from '../../../../_shared/tools/tools';
import {
    CIVIC_ISSUE_ITEM,
    CIVIC_ISSUE_STATE,
} from '../../civic_issues/civic_issues.d';
import {
    getMockItem,
    getMockItems,
    MOCK_CIVIC_OPEN_2,
    MOCK_CIVIC_OPEN_3,
    MOCK_CIVIC_OPEN_ALL,
} from '../../civic_issues/civic_issues.mock';
import { DATA_ITEMS, DATA_TYPES, TARGET_CONFIG } from '../endpoints.d';
import {
    getLogPrefix,
    handleRequest,
    makeRequest,
    makeRequestByState,
} from './request';
import { LOG } from '../../../../_shared/log/log';
import { getURL, spyOnCMD } from '../../_shared/utils/utils';
import * as cmd from '../../../../_shared/cmd/cmd';
import { getMockCurlObject } from '../../../../_shared/http/http.mocks';
import { getResponseFromObject } from '../../../../_shared/http/http.helper';
import { CurlItem, Json } from '../../../..';
import { CUSTOM_REQUEST_PARAMS } from './request.d';
import { ENDPOINT_CONFIG_CIVIC_ISSUES } from '../../civic_issues/civic_issues.config';
import { getUrlParamNum } from '../../../../_shared/http/http';
import {
    ENDPOINT_CONFIG_NOMINATIM,
    ENDPOINT_NOMINATIM,
} from '../geo/geo.config';
import { MOCK_ADDRESS_ITEMS } from '../geo/geo.mock';
import { GEO_ID, PLACE } from '../geo/geo.d';
import { ENDPOINT_CONFIG } from '../data_items/data_items.d';

const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_CIVIC_ISSUES;

const createTargetConfig = (
    ENDPOINT: ENDPOINT_CONFIG,
    PARAMS: Json,
    customTarget = ''
): TARGET_CONFIG => {
    const target = substitute(ENDPOINT.endpoint.tmpl, PARAMS) + customTarget;
    const targetConfig = {
        target,
        opts: ENDPOINT.endpoint.opts,
        data_config: ENDPOINT.data_config,
    };
    return targetConfig;
};

describe('🧪 without deps', () => {
    describe('✅ getLogPrefix()', () => {
        const FN = getLogPrefix;
        it('should return correct log prefix', () => {
            const PARAMS: CUSTOM_REQUEST_PARAMS = {
                state: 'OPEN' as CIVIC_ISSUE_STATE,
                limit: 10,
                iteration: 2,
            };
            const EXPECTED = '[OPEN / 3]';
            const result = FN(PARAMS);
            expect(result).toEqual(EXPECTED);
        });
        it('should return correct log prefix with default state', () => {
            const PARAMS: CUSTOM_REQUEST_PARAMS = {
                limit: 10,
                iteration: 0,
            };
            const EXPECTED = '[API / 1]';
            const result = FN(PARAMS);
            expect(result).toEqual(EXPECTED);
        });
    });
});

describe('🧪 with mock data', () => {
    let spy: jest.SpyInstance;
    let logSpy: jest.SpyInstance;
    let failSpy: jest.SpyInstance;
    let debugSpy: jest.SpyInstance;
    let okSpy: jest.SpyInstance;
    type TYPE = CIVIC_ISSUE_ITEM;
    beforeEach(() => {
        logSpy = jest.spyOn(LOG, 'INFO');
        failSpy = jest.spyOn(LOG, 'FAIL');
        debugSpy = jest.spyOn(LOG, 'DEBUG');
        okSpy = jest.spyOn(LOG, 'OK');
        spy = spyOnCMD(); // <= ⚠️ important; don't remove
    });
    afterEach(() => {
        spy.mockRestore();
        jest.clearAllMocks();
        logSpy.mockRestore();
        failSpy.mockRestore();
        okSpy.mockRestore();
        debugSpy.mockRestore();
        // readline.cursorTo(process.stdout, 0);
    });
    const FALLBACK: DATA_ITEMS<CIVIC_ISSUE_ITEM> = { total: 0, items: [] };
    describe('✅ makeRequest()', () => {
        const FN = makeRequest;
        describe('📝 TYPE: list items', () => {
            const key = ENDPOINT.endpoint.key;
            const type = 'items';
            it('get data from API for 1st iteration', () => {
                const PARAMS = { state: 'OPEN', limit: 1, offset: 0 };
                const TARGET = createTargetConfig(ENDPOINT, PARAMS);
                const result: DATA_TYPES<TYPE> = FN(TARGET, type);
                expect(result.total).toEqual(2);
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 1`);
                expect(result).toEqual(MOCK_CIVIC_OPEN_2);
                expect(okSpy).toHaveBeenCalledWith('received data (1 items)');
            });
            it('get data from API for 2nd iteration', () => {
                const PARAMS = { state: 'OPEN', limit: 1, offset: 1 };
                const TARGET = createTargetConfig(ENDPOINT, PARAMS);
                const result: DATA_TYPES<TYPE> = FN(TARGET, type);
                expect(result.total).toEqual(2);
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 1`);
                expect(result).toEqual(MOCK_CIVIC_OPEN_3);
                expect(okSpy).toHaveBeenCalledWith('received data (1 items)');
            });
            it('get no data from API for out of range iteration', () => {
                const PARAMS = { state: 'FOO', limit: 1, offset: 2 };
                const TARGET = createTargetConfig(ENDPOINT, PARAMS);
                const id = 'X / 3';
                const result: DATA_TYPES<TYPE> = FN(TARGET, type, id);
                expect(result.total).toEqual(0);
                expect(debugSpy.mock.calls.length).toEqual(0);
                expect(failSpy.mock.calls.length).toEqual(2);
                expect(failSpy).toHaveBeenCalledWith('[X / 3] No data found');
                expect(result).toEqual(FALLBACK);
            });
            it('get no data from API if url is not valid', () => {
                const PARAMS = { state: 'OPEN', limit: 1, offset: 2 };
                const custom = '/{invalid}';
                const TARGET = createTargetConfig(ENDPOINT, PARAMS, custom);
                const result: DATA_TYPES<TYPE> = FN(TARGET, type);
                expect(result.total).toEqual(0);
                expect(debugSpy.mock.calls.length).toEqual(0);
                expect(failSpy.mock.calls.length).toEqual(1);
                expect(failSpy).toHaveBeenCalledWith(
                    `Invalid target: ${TARGET.target}`
                );
                expect(result).toEqual(FALLBACK);
            });
        });
        describe('🔗 TYPE: map', () => {
            const ENDPOINT = ENDPOINT_CONFIG_NOMINATIM;
            const TMPL = ENDPOINT_NOMINATIM.tmpl;
            type TYPE = PLACE;
            const type = 'map';
            it('should return simple item', () => {
                const lat = '52.4556561';
                const lon = '13.1005985';
                const geoID: GEO_ID = `${lat}-${lon}`;
                const ID = MOCK_ADDRESS_ITEMS[geoID].place_id;
                // TODO: place_id logik ausweiten
                const EXPECTED: DATA_TYPES<TYPE> = {
                    total: 1,
                    itemsById: {
                        [ID]: MOCK_ADDRESS_ITEMS[geoID],
                    },
                    // itemsById: MOCK_ADDRESS_ITEMS[geoID],
                };
                const OPTS = { lat, lon };
                const target = substitute(TMPL, OPTS);
                const CONFIG_GEO = {
                    totalKey: '',
                    itemsKey: '',
                    baseEndpoint: '',
                    idKey: 'place_id',
                };
                const targetConfig = {
                    target,
                    opts: ENDPOINT.endpoint.opts,
                    data_config: CONFIG_GEO,
                };
                const result: DATA_TYPES<TYPE> = FN(
                    targetConfig,
                    type,
                    undefined
                );
                expect(result).toEqual(EXPECTED);
            });
        });
        // TODO: test with json
    });
    describe('✅ handleRequest()', () => {
        const FN = handleRequest;
        it('should handle request and return data', () => {
            const state: CIVIC_ISSUE_STATE = 'OPEN';
            const limit = 1;
            const iteration = 0;
            const current = { state, limit, iteration };
            const result: DATA_TYPES<TYPE> = FN(ENDPOINT, current, 'items');
            expect(result).toEqual(MOCK_CIVIC_OPEN_2);
        });
    });
    describe('✅ makeRequestByState()', () => {
        const FN = makeRequestByState;
        const CUSTOM: CUSTOM_REQUEST_PARAMS = {
            state: 'OPEN' as CIVIC_ISSUE_STATE,
        };
        const key = 'civic_issues';

        it('should return the result of current iteration (1 iteration)', () => {
            const result: DATA_TYPES<TYPE> = FN(ENDPOINT, CUSTOM);
            expect(result).toEqual(MOCK_CIVIC_OPEN_ALL);
            expect(debugSpy.mock.calls.length).toEqual(1);
            expect(failSpy.mock.calls.length).toEqual(0);
            expect(failSpy).not.toHaveBeenCalledWith(
                '[OPEN] Total count changed (2 -> 3)'
            );
            expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 2`);
            expect(okSpy).toHaveBeenCalledWith(
                `Received 2 items for state OPEN [added: 2, skipped: 0, failed: 0]`
            );
        });
        it('should return the result of all iterations (2 iterations)', () => {
            const result: DATA_TYPES<TYPE> = FN(ENDPOINT, CUSTOM, 1);
            expect(result).toEqual(MOCK_CIVIC_OPEN_ALL);
            expect(debugSpy.mock.calls.length).toEqual(2);
            expect(failSpy.mock.calls.length).toEqual(0);
            expect(failSpy).not.toHaveBeenCalledWith(
                '[OPEN] Total count changed (2 -> 3)'
            );
            expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 1`);
            expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 1`);
            expect(result).toEqual(MOCK_CIVIC_OPEN_ALL);
            expect(okSpy).toHaveBeenCalledWith(
                `Received 2 items for state OPEN [added: 2, skipped: 0, failed: 0]`
            );
        });
        it('should return throw exception for a changed totalCnt', () => {
            spy.mockRestore();
            spy = jest // custom implementation
                .spyOn(cmd, 'command')
                .mockImplementation((request: string): string => {
                    // TODO: auslagern
                    const url = getURL(request).replace(/https?:\/\//, '');
                    const offset = getUrlParamNum(url, 'offset', '0');
                    const mockedExtraItem = clone(getMockItem('4'));
                    mockedExtraItem.id = 8;
                    const reports = getMockItems(['2', '3']);
                    if (offset !== 0) {
                        reports.push(getMockItem('4'));
                    }
                    let finalReports = [];
                    const limit: number = getUrlParamNum(url, 'limit', '1000');
                    if (limit) {
                        finalReports.push(...reports.slice(offset, limit));
                    }
                    let cnt = JSON.stringify({
                        isEmployee: false,
                        reports,
                        totalCnt: reports.length,
                    });
                    const curlItem: CurlItem = getMockCurlObject(200, cnt);
                    const result = getResponseFromObject(curlItem, cnt);
                    LOG.DEBUG(`🧪 MOCK: request offset: ${offset}`);
                    return result;
                });
            const result: DATA_TYPES<TYPE> = FN(ENDPOINT, CUSTOM, 1);
            const EXPECTED = { items: getMockItems(['2', '3', '4']), total: 3 };
            expect(result).toEqual(EXPECTED);
            expect(failSpy.mock.calls.length).toEqual(1);
            expect(failSpy).toHaveBeenCalledWith(
                '[OPEN] Total count changed (2 -> 3)'
            );
            expect(debugSpy.mock.calls.length).toEqual(3);
            expect(debugSpy).toHaveBeenCalledWith('🧪 MOCK: request offset: 0');
            expect(debugSpy).toHaveBeenCalledWith('🧪 MOCK: request offset: 1');
            expect(debugSpy).toHaveBeenCalledWith('🧪 MOCK: request offset: 2');
            // TODO: verify
            expect(okSpy).toHaveBeenCalledWith(
                `Received 8 items for state OPEN [added: 3, skipped: 5, failed: 0]`
            );
        });
    });
});
