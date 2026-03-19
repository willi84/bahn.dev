import { HTTP_OPTS } from '../../../../_shared/http/http.d';
import { LOG } from '../../../../_shared/log/log';
import { KEY_VALUES, STATS } from '../../../../_shared/tools/tools.d';
import {
    substitute,
    sumStats,
    updateItems,
    updateItemsArray,
} from '../../../../_shared/tools/tools';
import { getItemsArray, getItemsMap } from '../endpoints';
import {
    DATA_ITEMS,
    TARGET_CONFIG,
    DATA_TYPES,
    DATA_ENTRY,
    DATA_TYPE,
    DATA_MAP,
} from '../endpoints.d';
import { CUSTOM_REQUEST_PARAMS } from './request.d';
import { getResponse } from '../../../../_shared/http/http';
import { CurlItem } from '../../../../index.d';
import { ENDPOINT_CONFIG } from '../data_items/data_items.d';

/**
 * 🎯 generate log prefix from request parameters
 * @param {KEY_VALUES} params ➡️ The parameters for the API request.
 * @returns {string} 📤 The generated log prefix.
 */
export const getLogPrefix = (params: KEY_VALUES): string => {
    const state = params.state ? (params.state as string) : 'API';
    const iteration = (params.iteration as number) + 1;
    const prefix = `[${state} / ${iteration}]`;
    return prefix;
};

/**
 * 🎯 make request to civic issues API, extend the array and return response data
 * to make sure everything works as expected
 * @param {TARGET_CONFIG} targetConfig ➡️ The target URL for the API request.
 * @param {string} prefix ➡️ The key for logging purposes.
 * @param {DATA_TYPE} type ➡️ The data type ('items' or 'map').
 * @returns {DATA_ITEMS} 📤 The raw civic issue data retrieved from the API.
 */
export const makeRequest = <T>(
    targetConfig: TARGET_CONFIG,
    type: DATA_TYPE,
    prefix?: string
): DATA_TYPES<T> => {
    const prefixID = prefix ? `[${prefix}] ` : '';
    const target = targetConfig.target;
    if (target.match(/[\{\}]/)) {
        LOG.FAIL(`${prefixID}Invalid target: ${target}`);
    } else {
        const config = targetConfig.data_config;
        LOG.INFO(`Fetching data from ${target}...`);
        const opts: HTTP_OPTS = targetConfig.opts; // TODO
        const rawData: CurlItem = getResponse(target, opts);
        if (type === 'items') {
            let result: DATA_ITEMS<T> = { total: 0, items: [] }; // default
            const allItems: any[] = [];
            const data: DATA_TYPES<T> = getItemsArray(rawData.content, config);
            const total = data.total;
            // TODO: REFACTOR
            if (data.items && !data.error) {
                if (Array.isArray(data.items) === true) {
                    // { total: 1, items: [...] }
                    const stats = updateItemsArray<T>(allItems, data.items);
                    const statsTotal = sumStats(stats);
                    result = { total, items: allItems }; // ggf. clone()
                    LOG.OK(`${prefixID}received data (${statsTotal} items)`);
                } else {
                    // convert single item to array
                    // TODO mit id optimieren
                    const items = [data.items];
                    const stats = updateItemsArray<T>(allItems, items);
                    const statsTotal = sumStats(stats);
                    const total = items.length;
                    result = { total, items: allItems };
                    LOG.OK(`${prefixID}received data (${statsTotal} items)`);
                }
            } else {
                LOG.FAIL(`${prefixID}No data found`);
                // { total: 0, items: [], error: 'Invalid JSON' }
            }
            return result;
        } else if (type === 'map') {
            let result: DATA_MAP<T> = { total: 0, itemsById: {} }; // default
            const allItems: DATA_ENTRY<T> = {};
            const data: DATA_TYPES<T> = getItemsMap(rawData.content, config);
            // TODO: abgesten
            // TODO fix and handle wront type
            // console.log(data);
            const total = data.total;
            if (data.itemsById && !data.error) {
                if (Array.isArray(data.itemsById) === true) {
                    LOG.FAIL(`${prefixID}Invalid type: array (expected: map)`);
                    //
                    // console.log(target);
                    // console.log(data, rawData.content);
                    // used ?
                    // console.log(data);
                } else {
                    // console.log(data);
                    // { total: 1, itemsById: { ... } }
                    // TODO updateItems for map type
                    const stats = updateItems<T>(allItems, data);
                    const statsTotal = sumStats(stats);
                    result = { total, itemsById: allItems }; // ggf. clone()
                    LOG.OK(`${prefixID}received data (${statsTotal} items)`);
                }
            } else {
                // console.log(data);
                // used?
                LOG.FAIL(`${prefixID}No data found`);
            }
            return result;
            // TODO implement map type
        }
    }
    return { total: 0, items: [] } as DATA_TYPES<T>; // default return
};
/**
 * 🎯 handle request to civic issues API
 * @param {ENDPOINT_CONFIG} ENDPOINT ➡️ The endpoint configuration.
 * @param {KEY_VALUES} params ➡️ The parameters for the API request.
 * @returns {DATA_ITEMS} 📤 The raw civic issue data retrieved from the API.
 */
export const handleRequest = <T>(
    ENDPOINT: ENDPOINT_CONFIG,
    params: KEY_VALUES,
    type: DATA_TYPE
): DATA_TYPES<T> => {
    if (params.hasOwnProperty('iteration') && params.hasOwnProperty('limit')) {
        const offset = (params.iteration as number) * (params.limit as number);
        params.offset = offset;
    }
    const TMPL = ENDPOINT.endpoint.tmpl;
    const data_config = ENDPOINT.data_config;
    const opts = ENDPOINT.endpoint.opts;
    const target = substitute(TMPL, params);
    const prefix = getLogPrefix(params);
    const TARGET_CONFIG = { target, opts, data_config };
    const result: DATA_TYPES<T> = makeRequest<T>(TARGET_CONFIG, type, prefix);
    return result;
};

/**
 * 🎯 make request(s) by state
 * @param {ENDPOINT_DATA} endpointConfig ➡️ The endpoint configuration.
 * @param {CUSTOM_REQUEST_PARAMS} custom ➡️ The custom request parameters.
 * @param {number} limit ➡️ The maximum number of items to fetch per request.
 * @param {DATA_TYPE} type ➡️ The data type ('items' or 'map').
 * @returns {DATA_ITEMS} 📤 The raw civic issue data retrieved from the API.
 */
export const makeRequestByState = <T>(
    endpointConfig: ENDPOINT_CONFIG,
    custom: CUSTOM_REQUEST_PARAMS,
    limit: number = 1000,
    type: DATA_TYPE = 'items'
): DATA_TYPES<T> => {
    let total = -1;
    let iteration = 0;
    const isItems = type === 'items';
    const items: T[] = [];
    const itemsById: DATA_ENTRY<T> = {};
    const state = custom.state ?? 'API';
    let iterations = 1;
    let stats: STATS = { added: 0, skipped: 0, failed: 0 };

    do {
        const params: CUSTOM_REQUEST_PARAMS = { ...custom, limit, iteration };

        const data = handleRequest<T>(endpointConfig, params, type);
        const localStats = updateItems(
            type === 'items' ? (items as T[]) : (itemsById as DATA_ENTRY<T>),
            data
        );
        stats.added += localStats.added;
        stats.skipped += localStats.skipped;
        stats.failed += localStats.failed;

        if (data.total !== total) {
            const change = `(${total} -> ${data.total})`;
            LOG[iteration === 0 ? 'OK' : 'FAIL'](
                `[${state}] Total count changed ${change}`
            );
            total = data.total;
            iterations = Math.ceil(data.total / parseInt(limit.toString(), 10));
        }

        iteration++;
    } while (iteration < iterations);
    const result: DATA_TYPES<T> = isItems
        ? { items, total }
        : { itemsById, total };
    result.total = total;

    // TODO: anpassen
    const statsTotal = sumStats(stats);
    LOG.OK(
        `Received ${statsTotal} items for state ${state} [added: ${stats.added}, skipped: ${stats.skipped}, failed: ${stats.failed}]`
    );
    return result;
};
