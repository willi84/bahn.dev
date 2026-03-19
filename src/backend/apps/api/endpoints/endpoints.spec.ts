import {
    DATA_CONFIG,
    DATA_ITEMS,
    DATA_TYPES,
    SAMPLE_DATA,
} from './endpoints.d';
import { getItemsArray, getItemsMap, translatedData } from './endpoints';
// import { getData } from './endpoints';
import { getResponseFromObject } from '../../../_shared/http/http.helper';
import { getMockCurlObject } from '../../../_shared/http/http.mocks';
import { CONFIG_CIVIC_ISSUES_DATA } from '../civic_issues/civic_issues.config';
import { CIVIC_ISSUE_ITEM } from '../civic_issues/civic_issues.d';
import {
    FAKE_LIST_RESULT_2,
    FAKE_MAP_RESULT_2,
} from '../_shared/utils/utils.mock';
import {
    ENDPOINT_CONFIG_SAMPLE_LIST,
    ENDPOINT_CONFIG_SAMPLE_MAP,
} from '../_shared/utils/utils.config';
import { SAMPLE_LIST, SAMPLE_MAP } from './data_items/data_items.d';
import { getMockItems } from '../civic_issues/civic_issues.mock';

const DEFAULT_CONFIG: DATA_CONFIG = CONFIG_CIVIC_ISSUES_DATA;

// TODO: ggf. in http.mocks.ts verschieben
const getMockedAPI = (request: string): string => {
    const isUnknown = request.includes('unknown');
    // TODO: nodexjs
    const content = isUnknown ? '' : '{ "xxx": 2 }';
    const status = isUnknown ? 404 : 200;
    const response = getMockCurlObject(status, content);
    const result = getResponseFromObject(response, response.content);
    return result;
};
describe('🧪 with mock data', () => {
    const API = 'https://FAKE.api';
    describe('✅ getMockedAPI()', () => {
        const FN = getMockedAPI;
        it('should return mocked API response for known endpoint', () => {
            expect(FN(`${API}/test_data`)).toContain('200 OK');
            expect(FN(`${API}/test_data`)).toContain('{ "xxx": 2 }');
        });
        it('should return mocked API response for unknown endpoint', () => {
            expect(FN(`${API}/unknown`)).toContain('404 Not Found');
        });
    });
});

describe('🧪 translatedData()', () => {
    const FN = translatedData;
    describe('best case scenarios', () => {
        describe('📋 TYPE: items', () => {
            it('should translate raw sample data into DATA_ITEMS', () => {
                const input = JSON.stringify(FAKE_LIST_RESULT_2);
                const data_config = ENDPOINT_CONFIG_SAMPLE_LIST.data_config;
                const result = FN<SAMPLE_DATA>(input, data_config, []); // def SIMPLE_LIST is not working
                expect(result).toEqual(FAKE_LIST_RESULT_2);
            });
            it('should translate raw civic issue data into DATA_ITEMS', () => {
                type T = CIVIC_ISSUE_ITEM;
                const inputObject = {
                    totalCnt: 4,
                    reports: [1, 2, 3, 4],
                };
                const EXPECTED = {
                    total: 4,
                    items: [1, 2, 3, 4],
                };
                const data_config = CONFIG_CIVIC_ISSUES_DATA;
                const input = JSON.stringify(inputObject);
                const result: DATA_TYPES<T> = FN<T>(input, data_config, []);
                expect(result).toEqual(EXPECTED);
            });
            it('should translate other issue data into DATA_ITEMS', () => {
                const inputObject = {
                    count: 4,
                    list: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
                };
                const data_config = {
                    baseEndpoint: '',
                    totalKey: 'count',
                    itemsKey: 'list',
                };
                const EXPECTED = {
                    total: 4,
                    items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
                };
                const input = JSON.stringify(inputObject);
                const result = FN<CIVIC_ISSUE_ITEM>(input, data_config, []);
                expect(result).toEqual(EXPECTED);
            });
        });
        describe('🧩 TYPE: map', () => {
            it('should translate raw sample data into DATA_MAP', () => {
                const input = JSON.stringify(FAKE_MAP_RESULT_2);
                const data_config = ENDPOINT_CONFIG_SAMPLE_MAP.data_config;
                const result = FN<SAMPLE_DATA>(input, data_config, {});
                expect(result).toEqual(FAKE_MAP_RESULT_2);
            });
        });
    });
    // TODO: auch mit 1 und 3
});
describe('✅ getItemsArray()', () => {
    const FN = getItemsArray;
    const reports = [2, 'foo'];
    it('should extract items array from raw data without baseEndpoint', () => {
        const raw: any = { totalCnt: 2, reports };
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = DEFAULT_CONFIG;
        const result = FN(response, config);
        expect(result.items.length).toEqual(2);
        expect(result.items).toEqual(reports);
    });
    it('should extract items array from raw data with baseEndpoint', () => {
        const raw: any = {
            data: {
                totalCnt: 2,
                reports,
            },
        };
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = {
            baseEndpoint: 'data',
            totalKey: 'totalCnt',
            itemsKey: 'reports',
        };
        const result: DATA_ITEMS<CIVIC_ISSUE_ITEM> = FN(response, config);
        expect(result.items.length).toEqual(2);
        expect(result.items).toEqual(reports);
    });
    it('should return empty array if itemsKey not found', () => {
        const raw: any = { totalCnt: 2 };
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = DEFAULT_CONFIG;
        const result: DATA_ITEMS<CIVIC_ISSUE_ITEM> = FN(response, config);
        // TODO: is not map items if  everything else is missed
        expect(result.items).toEqual([]);
        expect(result.items.length).toEqual(0);
    });
});
describe('✅ getItemsMap()', () => {
    const FN = getItemsMap;
    const reports = { '1': 2, '2': 'foo' };
    it('should extract items map from raw data without baseEndpoint', () => {
        const raw: any = { totalCnt: 2, reports };
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = {
            baseEndpoint: '',
            totalKey: 'totalCnt',
            itemsKey: 'reports',
            idKey: 'id',
        };
        const result = FN(response, config);
        expect(Object.keys(result.itemsById).length).toEqual(2);
        expect(result.itemsById).toEqual(reports);
    });
    it('should extract items map from raw data with baseEndpoint', () => {
        const raw: any = {
            data: {
                totalCnt: 2,
                reports,
            },
        };
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = {
            baseEndpoint: 'data',
            totalKey: 'totalCnt',
            itemsKey: 'reports',
            idKey: 'id',
        };
        const result = FN(response, config);
        expect(Object.keys(result.itemsById).length).toEqual(2);
        expect(result.itemsById).toEqual(reports);
    });
    it('should return empty map if itemsKey not found', () => {
        const raw: any = {};
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = DEFAULT_CONFIG;
        const result = FN(response, config);
        expect(Object.keys(result.itemsById).length).toEqual(0);
        expect(result.itemsById).toEqual({});
    });
    it('should return error message if error found in raw data', () => {
        const raw: any = { error: 'Some error occurred' };
        const response = JSON.stringify(raw);
        const config: DATA_CONFIG = DEFAULT_CONFIG;
        const result = FN(response, config);
        expect(Object.keys(result.itemsById).length).toEqual(0);
        expect(result.itemsById).toEqual({});
        expect(result.error).toEqual('Some error occurred');
    });
});
