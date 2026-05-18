import type { $string } from '../../../../../index.d';
import { LOG } from '../../../../../_shared/log/log';
import type { SET_VALUE_OPTS } from './parse-utils.d';
import { setContentValue, updateKeys } from '../parse-setter/parse-setter';
import { ALTERNATIVE_KEYS } from '../parse-setter/parse-setter.config';
import { PARSE_LOG } from '../parse';
import { LogType } from '../../../../../_shared/log/log.config';
import { ParseLogs } from '../parse-logs/parse-logs';
import { handleCommon } from '../../parse-netex/parse-netex';

export const getFirstKey = (node: any): $string => {
    return Object.keys(node)[0]
}

export const getContentByKey = (node: any, key: string) => {
    if(!node.hasOwnProperty(key)) return undefined;
    return node[key].content;
}
export const getFirstChildProperty = (node: any, property: string, debug = false) => {
    const isArray = Array.isArray(node);
    const children = isArray ? node : node.children;
    if(children.length > 0){
        const firstChild = children[0];
        const key = getFirstKey(firstChild);
        return  key ? firstChild[key][property] : null;
    }
    return null;
}
// export const getFirstChildByProperty = (node: any, property: string) => {
//     const isArray = Array.isArray(node);
//     const children = isArray ? node : node.children;
    
//     if(children.length > 0){
//         const firstChild = children[0];
//         return firstChild[property];
//     }
//     return null;
// }

export const getFirstChildContent = (node: any) => {
    return getFirstChildProperty(node, 'content');
}

/**
 * 🎯 stabilized set value function
 */
export const setValue = (node: any, property: $string, value: any, opts: SET_VALUE_OPTS = {}) => {
    const isCamelCase = opts.hasOwnProperty('camelCase') ? opts.camelCase : true; // defauilt
    if(!property) {
        LOG.WARN('Property is undefined, cannot set value');
        return;
    }
    if(typeof node !== 'object' || node === null) {
        LOG.WARN(`Node is not an object, cannot set property ${property}`);
        return;
    }
    // TODO: testing
    let actualProperty = ALTERNATIVE_KEYS[property] ||property;
    let finalProperty = isCamelCase ? firstCharLowerCase(actualProperty) : actualProperty;
    if(!node.hasOwnProperty(finalProperty)){
        const isObject = typeof value === 'object' && value !== null;
        if(isObject){
            node[finalProperty] = {
                ...value
            }
        } else {
            node[finalProperty] = value;
        }
    } 
    if(opts.keys && Array.isArray(opts.keys)){
        updateKeys(opts.keys, opts.key || property);
    }
}
export const extendValue = (existing: any, newItem: any, debug = false) => {
    if(debug){
    }
    existing = {
        ...existing,
        ...newItem
        // ...getKeyValue(item)
    }
    return existing;
}
export const getFirstNode = (node: any) => {
    const _k = getFirstKey(node);
    if(!_k) return node
    return node[_k];
}
export const getFirstNodeProperty = (node: any, property: string) => {
    const firstNode = getFirstNode(node);
    return firstNode[property];
};
// TODO: testing
export const getFirstNodeContent = (node: any) => {
    return getFirstNodeProperty(node, 'content');
}
export const getKeyValue = (node: any, debug = false) => {
    const children = node.children;
    if(children.length < 2){
        LOG.WARN('Node does not have enough children to extract key value pair');
        return undefined;
    }
    let key;
    let value;
    for(const child of children){
        const childKey = getFirstKey(child);
        switch(childKey){
            case 'Key':
                key = child[childKey].content;
                break;
            case 'Value':
                value = child[childKey].content;
                break;
        }
    }
    const result = key && value ? { [key]: value} : undefined;
    return result;
}

export const getKeyList = (node: any) => {
    let keyListMeta: any = {}
    const keyList = node.keyList ? node.keyList : node;
    for(const child of keyList.children){
        const key = getFirstKey(child);
        if(key === 'KeyValue'){
            keyListMeta = extendValue(keyListMeta, getKeyValue(child.KeyValue, true), true);
        }
    }
    return keyListMeta;
}


export const firstCharLowerCase = (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
export const getRef = (json: any) => {
    const result = {};
    const node = getFirstNode(json);
    for(const key in node){
        if(key === 'ref'){
            setValue(result, 'ref', node[key]);
        } else {

            const newKey = firstCharLowerCase(key).replace(/ref/ig, '');
            setValue(result, newKey, node[key]);
        }
    }
    return result;
};

export const checkMissingKeys = (allKeys: string[], context: string, logs: ParseLogs) => {
    const isMissing = allKeys.length > 0;
    if(isMissing){
        logs.addWarning(`[${context}] not fully processed`, allKeys);
    }
    return isMissing;
}
export const getChildren = (json: any, keys: string[], filterItems: string[] = []) => {
    if(!json.hasOwnProperty('children') || !Array.isArray(json.children)) {
        LOG.WARN('Node does not have children property or it is not an array');
        return [];
    }
    // TODO: test
    const children = json.children.filter((child: any) => {
        const key = getFirstKey(child);
        const isFiltered = key && !filterItems.includes(key);
        return isFiltered;
    });
    if(children && Array.isArray(children)){
        updateKeys(keys, 'children');
        return children;
    }
    return [];
}
export const getChildKeys = (json: any) => {
    const keys = json.map((item: any) => getFirstKey(item));
    return keys;
}
export const getChildKeyIDs = (json: any) => {
    const keys = json.map((item: any) => getFirstNode(item).id)
    .filter((item: any) => item !== undefined);
    return keys;
}
export const getID = (json: any, keys: string[] = []) => {
    const id = getFirstNodeProperty(json, 'id');
    if (id) updateKeys(keys, 'id');
    return id;
}
export const copy = (arr: Array<string>) => {
    return JSON.parse(JSON.stringify(arr));
};

// string, {}, { ref, xx }
export const getRefValue = (json: any) => {
    let val;
    const refNode = getFirstNode(json);
    if(Object.keys(refNode).length === 1){
        val = refNode.ref;
    } else {
        val = getRef(json);
    }
    return val;
}
export const iterateChildren = (children: any, key: string, logs: ParseLogs) => {
    const items: any = {};
    let result: any = {};
    for(const child of children){
        const subFn = getFirstNode(child);
        const keys = Object.keys(subFn);
        const id = getID(child, keys);
        for(const k of copy(keys)){
            switch(k){
                
                case 'children': 
                    const subChildren = getChildren(subFn, keys);
                    const subKeys = getChildKeys(subChildren);
                    for(const item of subChildren){
                        const fnKey = getFirstKey(item);
                        handleCommon(items, fnKey, item, subKeys, logs);
                    }
                   
                    break
                default: 
                const firstNodeKey = getFirstKey(child);
                handleCommon(items, firstNodeKey, child, keys, logs);
            }
        }
        // if id exists it is a resultSet, otherwise it is a common item
        if(id){
            result[id] = items;
        } else {
            result = { ...result,
                ...items
            }
        }
        checkMissingKeys(keys, `iterateChildren: ${key}`, logs);
    }
    return result;
}
export const getContentValueFromChilds = (nextItem: any, logs: ParseLogs) => {
    const firstNode = getFirstNode(nextItem);
    const firstKey = getFirstKey(nextItem);
    const keys = Object.keys(firstNode);
    const result: any = {};
    if(firstKey){
        const key: string = getFirstKey(firstNode) || 'unknownKey';
        for(const k of copy(keys)){
            switch(k){
                case 'children':
                    const children = getChildren(firstNode, keys);
                    for(const detail of children){
                        const fn = getFirstNode(detail);
                        
                        const subKeys = Object.keys(fn);
                        let items: any = {}
                        const fk = getFirstKey(detail) || 'unknownKey';
                        for(const subKey of copy(subKeys)){
                            const k = getFirstKey(detail);
                            switch(subKey){
                                case 'content':
                                    setContentValue(detail, result, subKeys);
                                    break;
                                case 'children':
                                    const subChildren = getChildren(fn, subKeys);
                                    const items2 = iterateChildren(subChildren, fk, logs);
                                    items = { ...items, ...items2}
                                    break;
                                default:
                                    handleCommon(items, subKey, fn, subKeys, logs);
                                    break;
                            }
                        }
                        setValue(result, fk, items, {keys: subKeys, key: k});
                        checkMissingKeys(subKeys, `getContentValueFromChilds > CHILD: ${key}`, logs);
                    }
                    checkMissingKeys(keys, `getContentValueFromChilds: ${key}`, logs);
                    break;
                default:
                    handleCommon(result, k, firstNode, keys, logs);
            }
        }

        checkMissingKeys(keys, 'setContentValueFromChilds', logs);
    }
    return result;
}