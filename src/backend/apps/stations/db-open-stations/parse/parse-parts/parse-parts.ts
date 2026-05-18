import { handleCommon } from '../../parse-netex/parse-netex';
import { ParseLogs } from '../parse-logs/parse-logs';
import { checkMissingKeys, copy, getChildKeyIDs, getChildKeys, getChildren, getFirstChildContent, getFirstKey, getFirstNode, getFirstNodeProperty, getID, getKeyList, getRef, setValue } from '../parse-utils/parse-utils';

export const getRoles = (json: any, logs: ParseLogs) => {
    const result: any = {};
    // TODO: eigene funktion
    for(const role of json.roles.children){
        const firstNode = getFirstNode(role);
        if(!role.ResponsibilityRoleAssignment){
            const roleKey = getFirstKey(role);
            logs.addWarning('Role node does not contain a ResponsibilityRoleAssignment', roleKey);
        }
        const keys = Object.keys(firstNode);
        const roleID = getID(role, keys);
        result[roleID] = {};
        for(const k of copy(keys)){ // use copy to avoid key is removed before iterated
            switch(k){
                case 'children':
                    const children = getChildren(firstNode, keys);
                    const childKeys = getChildKeys(children);
                    
                    for (const detail of children){
                        const _k = getFirstKey(detail);
                        if(_k){
                            handleCommon(result[roleID], _k, detail, childKeys, logs);
                        }
                    }
                    checkMissingKeys(childKeys, `Role: ${roleID}, feature`, logs); // 🧪 CHECK
                    break;
            default:
                setValue(result[roleID], k, firstNode[k], {keys});
            }
        }
        checkMissingKeys(keys, `Role: ${roleID}`, logs); // 🧪 CHECK
    }
    return result;
}
export const getCodespaces = (node: any, logs: ParseLogs) => {
    const result: any = {};
    const childIDs = getChildKeyIDs(node.children);
    for(const codespace of node.children){
        const item = getFirstNode(codespace);
        if(!codespace.Codespace){
            const differ = { expected: 'Codespace', actual: getFirstKey(codespace) };
            logs.addWarning('Codespace node does not contain a Codespace child', differ);
        }
        // const item = codespace.Codespace;
        const id = item.id;
        const xmlns = getFirstChildContent(item);
        if(id !== xmlns){
            logs.addWarning(`Codespace id does not match the xml ns `, { id, xmlns });
        }
        // TODO: refactor
        const valueItem = {
            url: item.children[1].XmlnsUrl.content,
            description: item.children[2].Description.content
        };
        setValue(result, id, valueItem, {keys: childIDs});

    }
    checkMissingKeys(childIDs, 'codespaces', logs); // 🧪 CHECK
    return result;
}
export const handleChildren = (children: any, context: string, logs: ParseLogs) => {
    const temp = {}
    const subKeys = getChildKeys(children);
    for(const child of children){
        const key = getFirstKey(child);
        handleCommon(temp, key, child, subKeys, logs);
    }
    checkMissingKeys(subKeys, `handleChildren: ${context}`, logs); // 🧪 CHECK
    return temp;
}
export const getValueSet = (children: any, logs: ParseLogs) => {
    const current: any = {}
    const keys = getChildKeys(children);
    for(const child of children){
        const item = getFirstNode(child);
        const k = getFirstKey(child);
        switch(k){
            case "values": 
                current.values = {};
                // TODO: subkeys
                for(const childItem of item.children){
                    const id = getFirstNodeProperty(childItem, 'id');
                    const first = getFirstNode(childItem);
                    setValue(current.values, id, getFirstChildContent(first), {keys, key: k});
                }
                break;
            default:
                handleCommon(current, k, child, keys, logs);
                break;
        }
    }
    checkMissingKeys(keys, 'Value Item', logs); // 🧪 CHECK
    return current;
}
export const handleStandardSet = (node: any, expected: string, logs: ParseLogs) => {
    const result: any = {};
    for(const child of node.children){
        let current: any = {}
        const item = getFirstNode(child);
        if(!child[expected]){
            logs.addWarning(`node does not contain an ${expected} child`, { actual: getFirstKey(child), expected });
        }
        const keys = Object.keys(item);
        const id = getID(child, keys);
        for(const key of copy(keys)){
            switch(key){
                case 'children':
                    const children = getChildren(item, keys);
                    const temp = getValueSet(children, logs);
                    current = {
                        ...current,
                        ...temp
                    }
                    
                    // setChildItems(item, itemResult, keys, logs);
                    break;
                default:
                    handleCommon(current, key, item, keys, logs);
                    break;
                }
        }
        setValue(result, id, current);
        checkMissingKeys(keys, `handleStandardSet ${expected}: ${id}`, logs); // 🧪 CHECK
    }
    return result;
}
export const getStopDetail = (node: any, logs: ParseLogs) => {
    const nextNode = getFirstNode(node);
    const keys = Object.keys(nextNode);
    const id = getID(node, keys);
    if(!id){
        return;
    }
    const temp: any = {};
    for(const k in nextNode){
        switch(k){
            case 'id':
                break;
            case 'children':
                const children = getChildren(nextNode, keys);
                const childKeys = getChildKeys(children);
                for(const child of children){
                    const key = getFirstKey(child);
                    handleCommon(temp, key, child, childKeys, logs);
                }
                checkMissingKeys(childKeys, `Stop Detail: ${id}, feature`, logs); // 🧪 CHECK
                break;
            default:
                setValue(temp, k, nextNode[k], {keys});
                break;
        }
    }
    checkMissingKeys(keys, `Stop Detail: ${id}`, logs); // 🧪 CHECK
    return {
        [id]: temp
    }
};

export const getStop = (child: any, logs: ParseLogs) => {
    const current: any = {};
    const nextNode = getFirstNode(child);
    const keys = Object.keys(nextNode);
    const id = getID(child, keys);
    if(!id){
        return;
    }
    const temp: any = {};
    for(const k in nextNode){
        switch(k){
            case 'id': break;
            case 'children':
                const children = getChildren(nextNode, keys);
                const childKeys = getChildKeys(children);
                for(const child of children){
                    const key = getFirstKey(child);
                    handleCommon(temp, key, child, childKeys, logs);
                    // TODO: keylist
                }
                checkMissingKeys(childKeys, `Stop: ${id}, feature`, logs); // 🧪 CHECK
                break;
            default:
                // setValue(temp, k, nextNode[k], {keys});
                handleCommon(temp, k, nextNode, keys, logs);
                break;
        }
    }
    checkMissingKeys(keys, `Stop: ${id}`, logs); // 🧪 CHECK
    if(temp){
        setValue(current, nextNode.id, temp, {keys});
    }
    return {
        [id]: temp
    }
}