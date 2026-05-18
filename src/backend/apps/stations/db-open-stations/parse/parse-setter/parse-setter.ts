import { ParseLogs } from '../parse-logs/parse-logs';
import { getValueSet } from '../parse-parts/parse-parts';
import type { SET_VALUE_OPTS } from '../parse-utils/parse-utils.d';
import { getChildren, getFirstKey, setValue } from '../parse-utils/parse-utils';

export const updateKeys = (allKeys: string[], originalKey: string) => {
    if(allKeys.length > 0){
        const index = allKeys.indexOf(originalKey);
        if(index > -1){
            allKeys.splice(index, 1);
        }
    }
}
export const setPropertyValueFromChilds = (node: any, target: any, property: string, allKeys: string[] = [], targetKey?: string) => {
    for(const item of node.children){
        setPropertyValue(item, target, property, allKeys, targetKey);
    }
}

export const setPropertyValue = (node: any, target: any, property: string, allKeys: string[] = [], targetKey?: string) => {
    const originalKey = getFirstKey(node);
    if(originalKey){
        const key = targetKey || originalKey;
        const sub = node[originalKey];
        if(sub.hasOwnProperty(property)) {
            const opts: SET_VALUE_OPTS = {
                keys: allKeys
            };
            if(key){
                // TODO: get correct key if its content
                // opts['key'] = key;
                const isCorrectKey = allKeys.indexOf(key) !== -1;
                if(!isCorrectKey){

                    opts['key'] = property;
                }
                // opts['key'] = originalKey;
            }
            setValue(target, key, sub[property], opts);
        }
    }
}
export const setContentValue = (detail: any, current: any, allKeys: string[] = []) => {
    setPropertyValue(detail, current, 'content', allKeys);
}

export const setChildItems = (item: any, current: any, keys: string[], logs: ParseLogs) => {
    const children = getChildren(item, keys);
    const temp = getValueSet(children, logs);
    current = {
        ...current,
        ...temp,
    };
}