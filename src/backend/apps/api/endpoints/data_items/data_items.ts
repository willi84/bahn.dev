import { Json } from '../../../..';
import { FS } from '../../../../_shared/fs/fs';
import { getHttpStatus } from '../../../../_shared/http/http';
import { LOG } from '../../../../_shared/log/log';
import {
    convertArray2MapOld,
    isArray,
    isObject,
    updateItems,
} from '../../../../_shared/tools/tools';
import { getJSON } from '../../_shared/utils/utils';
import { ENDPOINT_CONFIG } from './data_items.d';
import {
    DATA_CONFIG,
    DATA_ENTRY,
    DATA_ITEMS,
    DATA_MAP,
    DATA_MODE,
    DATA_TYPE,
    DATA_TYPES,
} from '../endpoints.d';
import { CUSTOM_REQUEST_PARAMS } from '../request/request.d';
import { makeRequestByState } from '../request/request';
import { FALLBACK_LIST, FALLBACK_MAP, PROP } from './data_items.config';
import {
    convertArray2Map,
    convertMap2Array,
} from '../data-convert/data-convert';

/**
 * 🎯 get total number of items in a map
 * @param {Json} map ➡️ The input map-like object.
 * @returns {number} 📤 The total number of items in the map.
 */
export const getTotalFromMap = (map: Json): number => {
    let count = 0;
    if (map.hasOwnProperty(PROP)) {
        return 1;
    }
    Object.keys(map).forEach((key) => {
        const item = map[key];
        if (item.hasOwnProperty(PROP)) {
            count += 1;
        }
    });
    const keys = Object.keys(map).filter(
        (key) => key.match(/^__[^_]+__$/) === null // filter out __meta_keys__
    );
    return count > 0 ? count : keys.length;
    // return count > 0 ? count : Object.keys(map).length;
};

export const convertData = <T>(
    json: Json,
    type: DATA_TYPE,
    byId?: string
): DATA_TYPES<T> => {
    const ERROR_INVALID_STRUCTURE = 'invalid data structure';
    if (type === 'items') {
        let convertable: Json | null = null;
        if (json.items) {
            if (Array.isArray(json.items) === true) {
                if (json.total && json.total === json.items.length) {
                    return json as DATA_ITEMS<T>;
                } else {
                    return { total: json.items.length, items: json.items };
                }
            } else {
                if (isObject(json.items)) {
                    convertable = json.items;
                }
            }
        } else {
            convertable = json.itemsById ? json.itemsById : json;
        }
        if (convertable) {
            const items = convertMap2Array<T>(convertable, byId);
            const total = items.length;
            return { total, items };
        } else {
            const items: any[] = [json];
            return { total: 1, items, error: ERROR_INVALID_STRUCTURE };
        }
    } else {
        let convertable: T[] | null = null;
        let invalid = null;
        if (json.items) {
            if (isArray(json.items)) {
                convertable = json.items;
            } else {
                invalid = json.items;
            }
        } else if (json.itemsById) {
            if (isArray(json.itemsById)) {
                convertable = json.itemsById;
            } else if (isObject(json.itemsById)) {
                const itemsById = json.itemsById;
                const total = getTotalFromMap(itemsById);
                return { total, itemsById };
            } else {
                invalid = json.itemsById;
            }
        } else {
            const keys = Object.keys(json);
            if (keys.length === 1 && isArray(json[keys[0]])) {
                convertable = json[keys[0]];
            } else {
                return {
                    total: 1,
                    itemsById: json as DATA_ENTRY<T>,
                    error: ERROR_INVALID_STRUCTURE,
                };
            }
        }
        if (convertable) {
            const itemsById = convertArray2Map<T>(convertable, byId);
            console.log(itemsById, 'x', convertable, byId)
            const total = getTotalFromMap(itemsById);
            return { total, itemsById };
        } else {
            return {
                total: 1,
                itemsById: invalid,
                error: ERROR_INVALID_STRUCTURE,
            };
        }
    }
};

export const normalizeData = <T>(
    raw: string,
    config: DATA_CONFIG,
    type: DATA_TYPE,
    byId?: string
    // fallback: T[] | { [key: string]: T }
): DATA_TYPES<T> => {
    const json = JSON.parse(raw);
    // fallback if correct type
    // default data corect type
    const hasTotal = json.total !== undefined;
    if (type === 'items') {
        if (json.items && Array.isArray(json.items) && hasTotal) {
            // no conversion needed
            return json;
        } else if (
            json.itemsById &&
            !Array.isArray(json.itemsById) &&
            hasTotal
        ) {
            // convert itemsById to items
            const items = convertMap2Array<T>(json.itemsById, byId);
            // const items = convertMap2ArrayOld<T>(json.itemsById);
            return { total: json.total, items };
        } else {
            // try to convert generic object to items
            if (!json.items && !json.itemsById) {
                const keys = Object.keys(json);
                let allPropsAreKeys = true;
                const allItems = [];
                for (const key of keys) {
                    if (typeof json[key] !== 'object') {
                        allPropsAreKeys = false;
                    } else {
                        const newItem = { ...json[key], _id: key };
                        allItems.push(newItem);
                    }
                }
                if (allPropsAreKeys) {
                    return { total: allItems.length, items: allItems };
                } else {
                    return { total: 1, items: [json] };
                }
            }
            return { total: 0, items: [], error: 'fallback value' };
        }
    } else {
        if (json.itemsById && !Array.isArray(json.itemsById) && hasTotal) {
            return json;
        } else if (json.items && Array.isArray(json.items) && hasTotal) {
            //const firstItem = json.items[0];
            //const key = Object.keys(json.items)
            const itemsById = convertArray2MapOld<T>(json.items);
            return { total: json.total, itemsById };
        } else {
            return { total: 0, itemsById: {}, error: 'fallback value' };
        }
    }
    return json;
};

/**
 * 🎯 get raw civic issues by API
 * @param {ENDPOINT_DATA} endpoint ➡️ The endpoint configuration.
 * @param {DATA_TYPE} type ➡️ The data type ('items' or 'map').
 * @param {number} limit ➡️ The maximum number of items to fetch per request.
 * @returns {DATA_ITEMS} 📤 The raw civic issue data retrieved from the API.
 */
export const getItemsByAPI = <T>( // TODO: abstrahieren
    endpointConfig: ENDPOINT_CONFIG,
    type: DATA_TYPE = 'items',
    limit: number = 1000
): DATA_TYPES<T> => {
    const items: T[] = [];
    const itemsById: DATA_ENTRY<T> = {};
    const isItems = type === 'items';
    // TODO: weiter auflösen
    const endpoint = endpointConfig.endpoint;
    const states =
        endpoint.states && endpoint.states.length > 0
            ? endpoint.states
            : ['undefined']; // default no specific state
    for (const state of states) {
        const custom: CUSTOM_REQUEST_PARAMS = state ? { state } : {};
        const data = makeRequestByState<T>(endpointConfig, custom, limit, type);
        updateItems(isItems ? items : itemsById, data);
    }
    const dataItesm = isItems ? { items } : { itemsById };
    const total = isItems ? items.length : Object.keys(itemsById).length;
    return { total, ...dataItesm };
};

/**
 * 🎯 read data from file with default data
 * @param {string} filePath ➡️ The path to the file.
 * @param {JSON} fallback ➡️ The default data to return if file does not exist.
 * @returns {object} 📤 The data object.
 */
export const readDataFromFile = (filePath: string, fallback: Json): Json => {
    const hasfile = FS.exists(filePath);
    if (!hasfile) {
        LOG.FAIL(`💾 file does not exist: ${filePath}`);
        return fallback;
    }
    const cachedData = FS.readFile(filePath);
    let json: Json = {};
    if (typeof cachedData === 'string') {
        json = getJSON(cachedData);
    } else if (typeof cachedData === 'object') {
        json = cachedData;
    }
    LOG.OK(`💾 data from file exists`);
    return json;
};

/**
 * 🎯 get Data from file in a specific allowed format
 * @param {string} filePath ➡️ The path to the file.
 * @returns {Json} 📤 The data items object.
 */
export const getItemsFromFile = <T>(
    filePath: string,
    mode: DATA_TYPE
): DATA_TYPES<T> => {
    // const hasfile = FS.exists(filePath);
    const isItems = mode === 'items';
    const key = isItems ? 'items' : 'itemsById';
    const defaultData: DATA_TYPES<T> = isItems ? FALLBACK_LIST : FALLBACK_MAP;
    const json = readDataFromFile(filePath, defaultData) as DATA_TYPES<T>;
    const items: any = json[key as keyof DATA_TYPES<T>];
    const isValidItems = isItems ? Array.isArray(items) : !Array.isArray(items);
    if (items && isValidItems && json.total !== undefined) {
        LOG.OK(`💾 data from file loaded`);
        return json;
    } else {
        LOG.FAIL(`💾 Invalid data format in file: ${filePath}`);
        return defaultData;
    }
};

/**
 * 🎯 get Data from file in items format
 * @param {string} filePath ➡️ The path to the file.
 * @returns {DATA_ITEMS} 📤 The data items object.
 */
export const getItemListFromFile = <T>(filePath: string): DATA_ITEMS<T> => {
    return getItemsFromFile<T>(filePath, 'items') as DATA_ITEMS<T>;
};

/**
 * 🎯 get Data from file in map format
 * @param {string} filePath ➡️ The path to the file.
 * @returns {DATA_MAP} 📤 The data map object.
 */
export const getItemMapFromFile = <T>(filePath: string): DATA_MAP<T> => {
    return getItemsFromFile<T>(filePath, 'map') as DATA_MAP<T>;
};

/**
 * 🎯 get fall back data by type
 * @param {DATA_TYPE} type ➡️ The data type ('items' or 'map').
 * @returns {DATA_TYPES} 📤 The fallback data object.
 */
export const getFallBackByType = <T>(type: DATA_TYPE): DATA_TYPES<T> => {
    return type === 'map'
        ? (FALLBACK_MAP as DATA_TYPES<T>)
        : (FALLBACK_LIST as DATA_TYPES<T>);
};

/**
 * 🎯 get raw issue data
 * @param {string} mode ➡️ The data mode ('live' or 'demo').
 * @param {ENDPOINT_CONFIG} ENDPOINT ➡️ The endpoint configuration.
 * @param {DATA_TYPE} type ➡️ The data type ('items' or 'map').
 * @returns {DATA_ITEMS} 📤 The raw issue data.
 */
export const getIssues = <T>(
    mode: DATA_MODE,
    ENDPOINT: ENDPOINT_CONFIG,
    type: DATA_TYPE = 'items'
): DATA_TYPES<T> => {
    const key = ENDPOINT.endpoint.key;
    const fallback: DATA_TYPES<T> = getFallBackByType<T>(type);
    switch (mode) {
        case 'live':
            LOG.INFO(`Fetching fresh ${key} data from API...`);
            const data: DATA_TYPES<T> = getItemsByAPI(ENDPOINT, type);
            return data;
        case 'demo':
            LOG.INFO(`💾 Loading demo ${key} data from file...`);
            const filePath = `src/_data/raw/${key}_demo.json`;
            return getItemsFromFile(filePath, type);
        case 'cache':
            LOG.INFO(`💾 Loading cache ${key} data from file...`);
            const filePath2 = `src/_data/raw/${key}_cache.json`;
            return getItemsFromFile(filePath2, type);
        default:
            LOG.FAIL(`Unknown data mode: ${mode}`);
            return fallback;
    }
};

export const proceedItems = <Z>(
    mode: DATA_MODE,
    endpointConfig: ENDPOINT_CONFIG,
    type: DATA_TYPE
): DATA_TYPES<Z> => {
    const endpoint = endpointConfig.endpoint;
    const baseConfig = endpointConfig.data_config;
    // check if API is available
    const status: number = getHttpStatus(endpoint.test_api);
    const isAccessible = status >= 200 && status < 300;

    // TODO: bei live und sampleData
    if (mode === 'live') {
        if (!isAccessible) {
            LOG.FAIL(
                `API not accessible (status: ${status}), switching to demo mode.`
            );
        } else {
            LOG.OK(`API is accessible (status: ${status}).`);
        }
    }
    let finalMode = isAccessible ? mode : 'demo';
    // get the mode
    const isLive = mode === 'live';
    // TODO: tests for maps
    const data_config: DATA_CONFIG = {
        baseEndpoint: isLive ? baseConfig.baseEndpoint : '',
        itemsKey: isLive ? baseConfig.itemsKey : 'items', // <= map ?
        totalKey: isLive ? baseConfig.totalKey : 'total',
        idKey: isLive ? baseConfig.idKey : 'id',
    };
    const newEndpoint: ENDPOINT_CONFIG = { endpoint, data_config };
    const result: DATA_TYPES<Z> = getIssues<Z>(
        // endpoint,
        finalMode,
        newEndpoint,
        type
    );
    // TODO: if is live and dev
    // read or write raw data (civic issues and coords)
    // read or write final data
    return result;
};

/**
 * 🎯 load items by mode and endpoint config (abstraction level)
 * @param {DATA_MODE} mode ➡️ The data mode ('live', 'demo', 'cache').
 * @param {ENDPOINT_CONFIG} endpoint ➡️ The endpoint configuration.
 * @param {DATA_TYPE} type ➡️ The data type (default: 'items').
 * @returns {DATA_TYPES} 📤 The data items.
 */
export const loadItems = <T>(
    mode: DATA_MODE,
    endpoint: ENDPOINT_CONFIG,
    type: DATA_TYPE = 'items'
): DATA_TYPES<T> => {
    const result: DATA_TYPES<T> = proceedItems<T>(mode, endpoint, type);
    return result;
};
