import { LOG } from '../../../../_shared/log/log';
import { clone, isObject } from '../../../../_shared/tools/tools';
import { Json } from '../../../../index.d';
import { ID, KEY, PROP, PROPS } from '../data_items/data_items.config';

/**
 * 🎯 Convert a map-like object to an array of items.
 * @param {Json} map ➡️ input map-like object
 * @param {string} [byID] ➡️ optional property name to extract items by
 * @returns {T[]} 📤 array of items
 */
export const getArrayFromMap = <T>(map: Json, byID?: string): T[] => {
    const result: T[] = [];
    const keys = Object.keys(map);
    if (keys.length === 0) return result;
    if (!byID) {
        result.push(clone(map));
    } else {
        // 1st level
        if (map.hasOwnProperty(byID)) {
            result.push(clone(map) as T);
            return result;
        } else {
            // 2nd level
            Object.entries(map).forEach(([key, item]) => {
                if (item.hasOwnProperty(byID)) {
                    const newItem = clone(item) as T;
                    (newItem as any)[PROP] = key;
                    result.push(newItem);
                } else if (Array.isArray(item)) {
                    item.forEach((subItem) => {
                        const newItem = clone(subItem) as T;
                        if (subItem.hasOwnProperty(byID)) {
                            (newItem as any)[PROP] = key;
                            if (isObject(subItem)) {
                                result.push(newItem);
                            }
                        }
                    });
                }
            });
        }
    }
    return result;
};

export const getMapFromArray = <T extends Json>(
    array: T[],
    byID?: string
): Json => {
    let result: Json = {};
    const props: string[] = [];
    array.forEach((item) => {
        if (byID) {
            if (item.hasOwnProperty(byID)) {
                if (item.hasOwnProperty(PROP)) {
                    const prop = item[PROP];
                    const newItem = clone(item) as any;
                    addProperty(result, prop, newItem, props);
                } else {
                    const id = item[byID];
                    addProperty(result, id, item, props);
                }
            }
        } else {
            if (item.hasOwnProperty(PROP)) {
                const prop = item[PROP];
                const newItem = clone(item) as any;
                // delete newItem[PROP];
                addProperty(result, prop, newItem, props);
            } else {
                const keys = Object.keys(item);
                const isSimpleObject =
                    keys.filter((k) => {
                        return !isObject(item[k]);
                    }).length > 0;
                if (isSimpleObject && keys.length === 1) {
                    // props.push(keys[0]);
                    props.push(item[keys[0]]);
                    if (!result[keys[0]]) {
                        result = { ...result, ...item };
                    } else {
                        LOG.WARN(`Item already has ${keys[0]}: ${result[keys[0]]}`);
                    }
                    // addProperty(result, keys[0], item[keys[0]], props);
                } else {
                    const properties = Object.keys(item).filter((k) =>! k.match(/^__[^_]+__$/));
                    props.push(...properties);
                    result = item;
                    // props.push(prop);
                }
                // result = item;
            }
        }
    });
    if (props.length > 0) {
        result[PROPS] = props;
    }
    return result;
};

/**
 * 🎯 Add a property to an item if it doesn't already exist, and log a warning if it does.
 * @param {any} item ➡️ the item to which the property should be added
 * @param {string} ID ➡️ the name of the property to add
 * @param {any} value ➡️ the value to assign to the property
 * @param {string[]} props ➡️ an array to track added properties (optional)
 * @returns {any} 📤 the modified item with the new property added if it didn't exist
 */
export const addProperty = (
    item: any,
    ID: string,
    value: any,
    props?: string[]
) => {
    if (!item.hasOwnProperty(ID)) {
        let newValue = clone(value);
        if (props && props.indexOf(ID) === -1) {
            props.push(ID);
            console.log(ID, item);
            // TODO: add [PROP] ??
        }
        item[ID] = newValue;
    } else {
        const oldValue = item[ID];
        // const oldValue = JSON.stringify(item[ID]);
        LOG.WARN(`Item already has ${ID}: ${oldValue}`);
    }
    return item; // return the modified item if needed
};

/**
 * 🎯 Convert a map-like object to an array of items, optionally adding meta properties.
 * @param {Json} map ➡️ input map-like object
 * @param {string} [byID] ➡️ optional property name to extract items by
 * @returns {DATA_ITEMS<T>} 📤 array formatted items
 */
export const convertMap2Array = <T>(map: Json, byID?: string): T[] => {
    const result: T[] = getArrayFromMap<T>(map, byID);
    result.map((item: any) => {
        if (byID && byID !== 'id') {
            const idValue = (item as any)[byID];
            // add alternate ID property
            addProperty(item, ID, idValue);

            // add key property
            addProperty(item, KEY, byID);
        }
        return item;
    });
    return result;
};

/**
 * 🎯 Convert an array of items to a map-like object and remove meta properties.
 * @param {T[]} array ➡️ input array of items
 * @param {string} [byID] ➡️ optional property name to build the map by
 * @returns {Json} 📤 map-like object
 */
export const convertArray2Map = <T extends Json>(
    array: T[],
    byID?: string
): Json => {
    const result: Json = getMapFromArray<T>(array, byID);
    return result;
};
