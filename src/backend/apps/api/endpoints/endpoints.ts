import { Json } from '../../../index.d';
import { FS } from '../../../_shared/fs/fs';
import { LOG } from '../../../_shared/log/log';
import { getJSON } from '../_shared/utils/utils';
import {
    DATA_CONFIG,
    DATA_ITEMS,
    DATA_MAP,
    DATA_TYPES,
    FILE_ITEM,
} from './endpoints.d';
import { FOUND_COORDS } from './geo/geo.d';
import { getFallBackByType } from './data_items/data_items';
import {
    convertArray2MapOld,
    convertMap2ArrayOld,
} from '../../../_shared/tools/tools';

/**
 * 🎯 translate raw data into typed data structure
 * @param {string} raw ➡️ The raw data object.
 * @param {DATA_CONFIG} config ➡️ The data configuration.
 * @param {object} fallback ➡️ The fallback data structure.
 * @returns {DATA_TYPES<T>} 📤 The translated data structure.
 */
export const translatedData = <T>(
    raw: string,
    config: DATA_CONFIG,
    fallback: object
): DATA_TYPES<T> => {
    const json: Json = getJSON(raw);
    const isArray = Array.isArray(fallback) === true;
    const key = isArray ? 'items' : 'itemsById';
    const fallBackData = getFallBackByType<T>(isArray ? 'items' : 'map');
    if (json.error) {
        const result = { ...fallBackData, error: json.error };
        return result;
    }
    // TODO: testing all variants of config and make a plan
    if (
        config.baseEndpoint === '' &&
        config.itemsKey === '' &&
        config.totalKey === '' &&
        config.idKey === ''
    ) {
        if (isArray) {
            return {
                total: 1,
                items: json as any[],
                // items: json as any[],
            };
            // } as DATA_ITEMS<T>;
        } else {
            return {
                total: 1,
                itemsById: json,
                // itemsById: json as any,
            };
            // } as DATA_MAP<T>;
        }
    }
    const hasExtraNode = config && config.baseEndpoint !== '';
    const data = hasExtraNode ? (json as any)[config.baseEndpoint] : json;
    if (!data) {
        // TODO: testing
        return fallBackData;
    }
    const dataEndpoint = data[config?.itemsKey] ? data[config?.itemsKey] : data;
    const hasID = config.idKey && config.idKey !== '';
    const id = dataEndpoint[config.idKey as keyof typeof dataEndpoint];
    const objectItems = hasID && id ? { [id]: dataEndpoint } : dataEndpoint;
    // console.log(config)
    // if(isArray && !Array.isArray(dataEndpoint)) {
    //     console.log(dataEndpoint, config, data);
    // }
    const hasCorrectStruct =
        dataEndpoint && data[config.totalKey] && data[config.itemsKey];
    const arr = hasCorrectStruct ? convertMap2ArrayOld<T>(dataEndpoint) : []; // TODO: nicht immer machen
    const endpoint: any = isArray
        ? Array.isArray(dataEndpoint) === true // array
            ? dataEndpoint
            : arr
        : objectItems; // map

    const itemsById = objectItems;
    const items = Array.isArray(dataEndpoint) === true ? dataEndpoint : arr;
    const typeOfItems = Array.isArray(endpoint) === true;

    const itemsLen = typeOfItems ? items.length : Object.keys(itemsById).length;
    // const totalAlternative = items
    //     ? items.length
    //     : itemsById
    //       ? Object.keys(itemsById).length
    //       : 0;
    // const totalAlternative = items2 ? itemsLen : 0;
    // const result = {
    //     total: data[config?.totalKey]
    //         ? data[config?.totalKey] //default use config
    //         : totalAlternative,
    //     // total: data[config?.totalKey] || 0,
    //     [key]: typeOfItems ? [...items2] : { ...items2 },
    // };
    const dataTotal = data[config?.totalKey];
    const total = dataTotal ? dataTotal : itemsLen;
    // const total = dataTotal ? dataTotal : totalAlternative;
    // } as DATA_TYPES<T>;
    // TODO: fallback
    // TODO: check items for T[]
    return typeOfItems ? { total, items } : { total, itemsById };
};

/**
 * 🎯 extract items array from raw data object
 * @param {string} raw ➡️ The raw data object.
 * @param {DATA_CONFIG} config ➡️ The data configuration.
 * @returns {DATA_ITEMS<T>} 📤 The extracted items array.
 */
export const getItemsArray = <T>(
    raw: string,
    config: DATA_CONFIG
): DATA_ITEMS<T> => {
    const result = translatedData<T>(raw, config, []) as DATA_ITEMS<T>;
    if (Array.isArray(result.items) === false) {
        // console.log(result); // TODO: testes
        LOG.FAIL(`Invalid data format: items is not an array`);
        const array: T[] = convertMap2ArrayOld<T>(result.items);
        return { total: array.length, items: array };
        // TODO: convert to array
    }
    return result;
};

/**
 * 🎯 extract items map from raw data object
 * @param {string} raw ➡️ The raw data object.
 * @param {DATA_CONFIG} config ➡️ The data configuration.
 * @returns {DATA_MAP<T>} 📤 The extracted items map.
 */
export const getItemsMap = <T>(
    raw: string,
    config: DATA_CONFIG
): DATA_MAP<T> => {
    const result = translatedData<T>(raw, config, {}) as DATA_MAP<T>;
    if (Array.isArray(result.itemsById) === true) {
        // console.log(result);
        const map = convertArray2MapOld<T>(result.itemsById);
        return { total: Object.keys(map).length, itemsById: map };
        // console.log(map);
        // console.log(result.itemsById);
        // console.log(config);
        // LOG.FAIL(`Invalid data format: itemsById is an array`);
        // return { total: 0, itemsById: {}, error: 'Invalid data format' };
    }
    return result;
};

export const _getDataFromfile = (FILE: FILE_ITEM, _default = {}): object => {
    const coordFile = FILE.path;
    const hasCachedCoord = FS.hasFile(coordFile);
    const foundCoords: FOUND_COORDS = hasCachedCoord
        ? (FS.readFile(coordFile) as FOUND_COORDS)
        : _default;
    const origin = hasCachedCoord ? '🗃️ cached' : '⭐ empty';
    LOG.OK(`[${origin}] Load data from ${FILE.key}`);
    return foundCoords;
};
export const saveDataTofile = (FILE: FILE_ITEM, data: object): void => {
    const coordFile = FILE.path;
    const oldData = FS.hasFile(coordFile)
        ? (FS.readFile(coordFile) as object)
        : {};
    if (JSON.stringify(oldData) === JSON.stringify(data)) {
        LOG.OK(`ℹ️ No changes detected for ${FILE.key}, skip save.`);
        return;
    } else {
        FS.writeFile(coordFile, data, 'replace', true);
        LOG.OK(`💾 Save data to ${FILE.key}`);
    }
};
