import { $string, CurlItem, Json, PlainObject } from '../../../../index.d';
import * as cmd from '../../../../_shared/cmd/cmd';
import { getResponseFromObject } from '../../../../_shared/http/http.helper';
import { getMockCurlObject } from '../../../../_shared/http/http.mocks';
import { getGeoID } from '../../endpoints/geo/geo';
import { MOCK_ADDRESS_ITEMS } from '../../endpoints/geo/geo.mock';
import { COORD } from '../../endpoints/geo/geo.d';
import { MOCK_ISSUES } from '../../civic_issues/civic_issues.mock';
import { LOG } from '../../../../_shared/log/log';
import { CIVIC_STATES } from '../../civic_issues/civic_issues.config';
import * as http from '../../../../_shared/http/http';
import {
    getHttpItemFromHeader,
    getUrlParam,
    getUrlParamNum,
} from '../../../../_shared/http/http';
import { FAKE_LIST_RESULT_3, FAKE_MAP_RESULT_3 } from './utils.mock';
import { STATS } from '../../../../_shared/tools/tools.d';
import {
    NOMINATIM_OSM,
    NOMINATIM_POLITIK,
} from '../../endpoints/geo/geo.config';
import { FAKE_API } from './utils.config';
/**
 * 🎯 Converts a name into an ID by normalizing characters and replacing non-alphanumeric characters.
 * @param {string} value ➡️ The input string to be converted into an ID.
 * @returns {string} 📤 The generated ID.
 */
export const generateID = (value: string, type = ''): string => {
    if (!value || value.trim() === '') {
        return '';
    }
    let result = value.toLowerCase();
    result = result.replace(/ä/g, 'ae');
    result = result.replace(/ö/g, 'oe');
    result = result.replace(/ü/g, 'ue');
    result = result.replace(/ß/g, 'ss');
    result = result.replace(/[^a-z0-9]/g, '_');
    result = result.replace(/_+/g, '_');
    result = result.replace(/^_/, '');
    result = result.replace(/_$/, '');
    if (type === 'street') {
        result = result.replace('strasse', 'str');
    }
    return result;
};

/** 🎯 extract URL from a curl command string
 * @param {string} request ➡️ The curl command string.
 * @returns {string} 📤 The extracted URL.
 */
export const getURL = (request: string): string => {
    const httpURLPattern = /(?<!\(\+)https?:\/\/[^\s"'`]+/;
    const match = request.match(httpURLPattern);
    if (match) {
        return match[0];
    } else {
        const withoutHttpURLPattern =
            /(?<!\-[A-Za-z]+)\s+['"`]([^\s"'`\+\.\/]+\.[^\s"'`\+\/]+\/[^\s"'`]*)/;
        const match2 = request.match(withoutHttpURLPattern);

        // TODO: improve stability e.g. // or so
        if (match2 && match2[1]) {
            return match2[1];
        }
        // console.log(match2);
        // no http/https found, return the original string
        // console.log(request);
    }
    return request;
};

/**
 * 🎯 sort items into an existing list by a key, avoiding duplicates
 * @param {T[]} items ➡️ The new items to add.
 * @param {T[]} allItems ➡️ The existing list of items.
 * @param {string} key ➡️ The key to check for duplicates (default is 'id').
 * @returns {T[]} 📤 The updated list of items.
 */
export const sortBy = <T>(items: T[], allItems: T[], key = 'id'): STATS => {
    const stats: STATS = { added: 0, skipped: 0, failed: 0 };
    for (const item of items) {
        const newID = item[key as keyof T];
        const isDuplicate =
            newID !== undefined &&
            allItems.find((current: any) => current[key] === newID);
        if (!isDuplicate) {
            allItems.push(item);
            stats.added += 1;
        } else {
            stats.skipped += 1;
        }
    }
    return stats;
    // return allItems;
};

const getNominatimURL = (url: string): string => {
    const lat: $string = getUrlParam(url, 'lat');
    const lon: $string = getUrlParam(url, 'lon');
    if (!lat || !lon) {
        return JSON.stringify({
            error: '🧪 MOCK: Missing lat/lon param',
        });
    }
    const coords: COORD = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
    };
    const geoID = getGeoID(coords);
    const resultGEO = MOCK_ADDRESS_ITEMS[geoID];
    LOG.DEBUG(`🧪 MOCK: geo reverse: ${resultGEO ? '1' : '0'}`);
    return resultGEO
        ? JSON.stringify(resultGEO)
        : JSON.stringify({ error: '🧪 MOCK: Unable to geocode' });
};

const getFakeApiData = (url: string): string => {
    let result: string = '';
    const type: string = getUrlParam(url, 'type') || 'list';
    const isUnknonw = url.includes('unknown');
    const isEmpty = url.includes('empty');
    if (isEmpty) {
        // simulate empty result
    } else if (isUnknonw) {
        result = '<p>500 unknown error</p>';
    } else {
        const data = type === 'list' ? FAKE_LIST_RESULT_3 : FAKE_MAP_RESULT_3;
        result = JSON.stringify(data);
        LOG.DEBUG(`🧪 MOCK: sample_data: ${FAKE_LIST_RESULT_3.total}`);
        // result = '{"total":3, items:[1,2,3]}';
    }
    return result;
};

/** 🎯 get content by URL (mocked)
 * @param {string} input ➡️ The input string containing the URL.
 * @returns {string} 📤 The content retrieved from the URL.
 */
export const getContetByUrl = (input: string): string => {
    const url = getURL(input).replace(/https?:\/\//, '');
    const domain = url.split('/')[0];
    let result: string = '';
    switch (domain) {
        case FAKE_API:
            // const type: string = getUrlParam(url, 'type') || 'list';
            // const isUnknonw = url.includes('unknown');
            // const isEmpty = url.includes('empty');
            // if (isEmpty) {
            //     // simulate empty result
            // } else if (isUnknonw) {
            //     result = '<p>500 unknown error</p>';
            // } else {
            //     console.log(url);
            //     const data =
            //         type === 'list' ? FAKE_LIST_RESULT_3 : FAKE_MAP_RESULT_3;
            //     result = JSON.stringify(data);
            //     LOG.DEBUG(`🧪 MOCK: sample_data: ${FAKE_LIST_RESULT_3.total}`);
            //     // result = '{"total":3, items:[1,2,3]}';
            // }
            // return result;
            return getFakeApiData(url);
        case NOMINATIM_POLITIK:
            return getNominatimURL(url);
        case NOMINATIM_OSM:
            return getNominatimURL(url);

        case 'mitgestalten.potsdam.de':
            // TODO
            const state: $string = getUrlParam(url, 'filteredStates');
            const limit: number = getUrlParamNum(url, 'limit', '1');
            const offset: number = getUrlParamNum(url, 'offset');
            let allReports = [];
            if (!state) {
                allReports = [...MOCK_ISSUES];
            } else {
                allReports = MOCK_ISSUES.filter((item) => item.state === state);
            }
            const reports = allReports
                .slice(offset, limit + offset)
                .sort((a, b) => a.id - b.id);
            if (state && CIVIC_STATES.indexOf(state as string) === -1) {
                return '<p>HTTP Status 400 – Bad Request</p>';
            }
            LOG.DEBUG(`🧪 MOCK: civic_issues: ${reports.length}`);
            result = JSON.stringify({
                totalCnt: allReports.length,
                reports,
                isEmployee: false,
            });
            return result;
        default:
            // TODO: handle different state
            LOG.DEBUG(`🧪 MOCK: no domain found`);
            return '🧪 MOCK: NO_RESULT';
    }
};

/**
 * 🎯 mock the resonse of a command.
 * @param {string} content ➡️ The content to return.
 * @param {string} status ➡️ The status code to return.
 * @returns {string} 📤 Get the expected response.
 */
export const spyOnCMD = (
    content?: string,
    status?: string
): jest.SpyInstance => {
    return jest
        .spyOn(cmd, 'command')
        .mockImplementation((request: string): string => {
            const cnt =
                content !== undefined ? content : getContetByUrl(request);
            // : getContetByUrl(request, status);
            const state = status ? status : cnt ? '200' : '500';
            const curlItem: CurlItem = getMockCurlObject(parseInt(state), cnt);
            const result = getResponseFromObject(curlItem, cnt);
            return result;
        });
};
/**
 * 🎯 get an object from the response content
 * @param {CurlItem} response ➡️ The curl response item.
 * @returns {PlainObject} 📤 The parsed object.
 */
export const getObject = (response: CurlItem): PlainObject => {
    const cnt = response.content;
    const result = cnt ? JSON.parse(cnt) : {};
    return result;
};

/**
 * 🎯 let the process sleep
 * @param {number} ms ➡️ The time to sleep in milliseconds.
 */
export const sleepSync = (ms: number) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
        // blockiert aktiv
    }
};

/**
 * 🎯 parse JSON content safely
 * @param {string} content ➡️ The JSON content as string.
 * @returns {Json} 📤 The parsed object.
 */
export const getJSON = (content: string): Json => {
    try {
        return JSON.parse(content);
    } catch (error) {
        LOG.FAIL(`Failed to parse JSON content: ${error}`);
        return { error: 'Invalid JSON' };
    }
};

// move
export const mockHttpItem = (state: number, content: string) => {
    const curlItem: CurlItem = getMockCurlObject(state, content);
    const header = getResponseFromObject(curlItem, content);

    const httpItem = getHttpItemFromHeader(header);
    // const httpItem = getHttpItemFromHeader(header);
    return httpItem;
};

export const mockServiceUnavailable = (): jest.SpyInstance => {
    return jest
        .spyOn(http, 'getHttpBase')
        .mockImplementation(() => mockHttpItem(503, 'Service Unavailable'));
};
