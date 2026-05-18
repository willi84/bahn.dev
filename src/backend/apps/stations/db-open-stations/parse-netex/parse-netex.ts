import { LOG } from '../../../../_shared/log/log';
import { checkMissingKeys, copy, getChildKeys, getChildren, getContentByKey, getContentValueFromChilds, getFirstKey, getFirstNode, getFirstNodeContent, getFirstNodeProperty, getID, getKeyList, getKeyValue, getRef, getRefValue, setValue } from '../parse/parse-utils/parse-utils';
import { setContentValue, updateKeys } from '../parse/parse-setter/parse-setter';
import type { $string } from '../../../../index.d';
import { ParseLogs } from '../parse/parse-logs/parse-logs';
import { getCodespaces, getRoles, getStop, handleStandardSet } from '../parse/parse-parts/parse-parts';
import { getFrameRef, getPartOfJSON } from '../parse/parse-getter/parse-getter';
import type { SET_VALUE_OPTS } from '../parse/parse-utils/parse-utils.d';


// TODO: auf ref object umstellen
export const getVersionRef = (base: any) => {
    return {
        [base.ref]: base.versionRef
    }
};
// TODO: testen
export const handleCommon = (result: any, key: $string, item: any, keys: string[] = [], logs: ParseLogs) => {
    if(!key){
        logs.addWarning('[handleCommon] Key is undefined, skipping item', item);
        return;
    }
    const opts: SET_VALUE_OPTS = {keys};
    let val = null;
    switch(key){
        case 'roles':
            val = getRoles(item, logs);
            break;
        case 'keyList':
            val = getKeyList(item);
            break;
        case 'TypeOfFrameRef':
            val = getVersionRef(item);
            break;
        case 'typesOfValue':
            val = handleStandardSet(item, 'ValueSet', logs)
            break;
        case 'codespaces':
            val = getCodespaces(item, logs);
            break;
        case 'Name':
            setValue(result, key, getContentByKey(item, key), opts);
            setValue(result, 'lang', item.Name.lang, opts); // TODO: besser machen
            break;
        default:
            const firstNode = getFirstNode(item);
            if(firstNode.ref){
                val = getRefValue(item);
            } else if(firstNode.content){
                val = getFirstNodeContent(item);
                if(keys.indexOf(key) === -1){
                    opts['key'] = 'content';
                }
            } else if (firstNode.children){
                // const childs = getChildren;
                const childs = firstNode.children;
                const firstChild = childs[0];
                const firstChildNode = getFirstNode(firstChild);
                let subVal: any = null;
                if(firstChildNode.children && firstChildNode.id){
                    // TODO: refactoring
                    for(const child of childs){
                        let subItem: any = {};
                        const k = getFirstKey(child);
                        if(k){
                            const childItem: any = child[k];
                            const subItemKeys = Object.keys(childItem);
                            const id = getID(child, subItemKeys);
                            setValue(subItem, id, {}, {keys: subItemKeys});
                            for(const subKey of copy(subItemKeys)){
                                switch(subKey){
                                    case 'children':
                                        const subChildren = getChildren(childItem, subItemKeys);
                                        const subChildrenKeys = getChildKeys(subChildren);
                                        for(const subChild of subChildren){
                                            const subKey = getFirstKey(subChild);
                                            if(subKey){
                                                handleCommon(subItem[id], subKey, subChild, subChildrenKeys, logs);
                                            }
                                        }
                                        checkMissingKeys(subChildrenKeys, `Subitem of ${key} with id ${id} - children`, logs); // 🧪 CHECK
                                        break;
                                    default:
                                        setValue(subItem[id], subKey, childItem[subKey], {keys: subItemKeys});
                                }
                            }
                            checkMissingKeys(subItemKeys, `Subitem of ${key} with id ${id}`, logs); // 🧪 CHECK
                            subVal = { ...subItem }
                        }
                    }
                } else {

                   subVal = getContentValueFromChilds(item, logs);

                }
                val = subVal;
            } else {
                val = item[key];
            }
    }
    if(val !== null){
        setValue(result, key, val, opts);
    } else {
    }
}


export const handleCompositeFrame = (node: any, key: string, keys: string[] = [], logs: ParseLogs) => {
    let result: any = {};
    const outerKeys = Object.keys(node);
    const children = getChildren(node, outerKeys, ['frames']); // frames is handled separately
    const innerKeys = getChildKeys(children);
    setValue(result, 'version', node.version, {keys: outerKeys});
    setValue(result, 'id', node.id, {keys: outerKeys});
    for(const childObject of children){
        const key = getFirstKey(childObject);
        if(key){
            const childItem = childObject[key];
            if(childItem){
                let input = key === 'keyList' ? childObject : childItem;
                handleCommon(result, key, input, innerKeys, logs);
            }
        }
    }
    if(!checkMissingKeys(outerKeys, 'dataObjects', logs)){
        updateKeys(keys, key);
    }
    return result;
}


export const getMetaData = (json: any, logs: ParseLogs) => {
    const root = json.PublicationDelivery;
    const result: any = {}
    let compositeFrame: any = {
        xml: {}
    };
    for (const key in root) {
        if(key.indexOf('xmlns') > -1){
            setValue(compositeFrame.xml, key, root[key]);
        } else {
            switch(key){
                case 'children':
                    const keys = getChildKeys(root.children);
                    for(const child of getChildren(root, keys)){
                        const item = getFirstNode(child);
                        const key = getFirstKey(child);
                        switch(key) {
                            case 'dataObjects':
                                const compositeFrameItem = getPartOfJSON(json, 'metadata');
                                compositeFrame = {
                                    ...compositeFrame,
                                    ...handleCompositeFrame(compositeFrameItem, key, keys, logs)

                                }
                                break;
                            default:
                                setContentValue(child, compositeFrame, keys);
                        }
                    }
                    break;
                    default:
                        // TODO: keys
                        handleCommon(result, key, root, [], logs);
                }
            }
        }
    result.meta = {
        compositeFrame
    }
    return result;
};

export const getRessources = (json: any, logs: ParseLogs) => {
    const result: any = {};
    const input = getPartOfJSON(json, 'metadata');
    const frame = getFrameRef(input, 'ResourceFrame', logs);
    if(frame){
        for(const sub of frame.children){
            const subKey = getFirstKey(sub);
            if(subKey){
                const item = sub[subKey];
                switch(subKey){
                    case 'organisations':
                        result[subKey] = handleStandardSet(item, 'Operator', logs);
                        break;
                    case 'responsibilitySets':
                        result[subKey] = handleStandardSet(item, 'ResponsibilitySet', logs);
                        break;
                    default:
                            const input = subKey === 'keyList' ? sub : item;
                            // TODO: update keys
                            handleCommon(result, subKey, input, [], logs);
                    }
            }
        }
    }
    return result;
};


export const getStops = (json: any, logs: ParseLogs) => {
    let result: any = {};
    const node = getPartOfJSON(json, 'stops');
    // TODO: handle standard
    setValue(result, 'version', node.version);
    setValue(result, 'keyList', getKeyList(node.children[0]));
    setValue(result, 'frameRef', getVersionRef(node.children[1].TypeOfFrameRef));
    let stops: any = {};
    let i = 0;
    const allStops = node.children[2].stopPlaces.children;
    for(const stop of allStops){
        const id = getID(stop);
        i += 1;
        const stopData = getStop(stop, logs);
        stops = {
            ...stops,
            ...stopData
        }
        LOG.OK(`Parsed stop ${id} (${i}/${allStops.length})`);
    }
    result['stops'] = stops;
    return result;
}

