/**
 * @jest-environment node
 */
import { checkMissingKeys, extendValue, firstCharLowerCase, getContentByKey, getContentValueFromChilds, getFirstChildContent, getFirstChildProperty, getFirstKey, getFirstNode, getFirstNodeContent, getFirstNodeProperty, getKeyList, getKeyValue, getRef, iterateChildren, setValue } from './parse-utils';
import { LOG } from '../../../../../_shared/log/log';
import { ParseLogs } from '../parse-logs/parse-logs';

describe('✅ getFirstKey()', () => {
    const FN = getFirstKey;
    it('should get the key of the first item', () => {
        expect(FN({a: 1})).toBe('a');
        expect(FN({a: 1, b: 2})).toBe('a');
        expect(FN({b: 2, a: 1})).toBe('b');
    });
    it('should return undefined if the object is empty', () => {
        expect(FN({})).toBeUndefined();
    });
});
describe('✅ getContentByKey()', () => {
    const FN = getContentByKey;
    it('should get the content of the key', () => {
        expect(FN({a: {content: 1}}, 'a')).toBe(1);
        expect(FN({a: {content: false}}, 'a')).toBe(false);
        expect(FN({a: {content: 1}, b: {content: 2}}, 'b')).toBe(2);
    });
    it('should return undefined if the key does not exist', () => {
        expect(FN({a: {content: 1}}, 'b')).toBeUndefined();
    });
});
describe('✅ getFirstChildProperty()', () => {
    const FN = getFirstChildProperty;
    it('should get the property of the first child', () => {
        expect(FN({children: [{a: {content: 1}}]}, 'content')).toBe(1);
        expect(FN({children: [{a: {content: false}}]}, 'content')).toBe(false);
        expect(FN({children: [{a: {content: 1}}, {b: {content: 2}}]}, 'content')).toBe(1);
    });
    it('should get the property of the first item in Array', () => {
        expect(FN([{a: {content: 1}}], 'content')).toBe(1);
    });
    it('should return null if there are no children', () => {
        expect(FN({children: []}, 'content')).toBeNull();
    });
    it('should return undefined if the property does not exist', () => {
        expect(FN({children: [{a: {content: 1}}]}, 'value')).toBeUndefined();
    });
});
// getFirstChildByProperty()
describe('✅ getFirstChildContent()', () => {
    const FN = getFirstChildContent;
    it('should get the content of the first child', () => {
        expect(FN({children: [{a: {content: 1}}]})).toBe(1);
        expect(FN({children: [{a: {content: false}}]})).toBe(false);
        expect(FN({children: [{a: {content: 1}}, {b: {content: 2}}]})).toBe(1);
    });
    it('should return null if there are no children', () => {
        expect(FN({children: []})).toBeNull();
    });
    it('should return undefined if the content does not exist', () => {
        expect(FN({children: [{a: {value: 1}}]})).toBeUndefined();
    });
});
describe('✅ setValue()', () => {
    const FN = setValue;
    it('should set the value if the property does not exist', () => {
        const obj: any = {};
        FN(obj, 'a', 1);
        expect(obj.a).toBe(1);
    });
    it('should not overwrite the value if property already exists', () => {
        const obj: any = {a: 1};
        FN(obj, 'a', 2);
        expect(obj.a).toBe(1);
    });
    it('should not overwrite the value if property exists', () => {
        const obj: any = {a: false};
        FN(obj, 'a', 2);
        expect(obj.a).toBe(false);
    });
    it('should raise no warning, when its an object', () => {
        const obj: any = {};
        console.warn = jest.fn();
        FN(obj, 'a', 1);
        expect(console.warn).not.toHaveBeenCalled();
    });
    it('should raise a warning, when its not an object', () => {
        const obj: any = 1;
        const spy = jest.spyOn(LOG, 'WARN');
        FN(obj, 'a', 1);
        expect(spy).toHaveBeenCalledWith('Node is not an object, cannot set property a');
    });
});
describe('✅ extendValue()', () => {
    const FN = extendValue;
    it('should extend the node with the key value pair of the item', () => {
        expect(FN({}, { X: 2})).toEqual({ X: 2});
        expect(FN({Y: 3}, { X: 2})).toEqual({ X: 2, Y: 3});
        expect(FN({X: 3}, { X: 2})).toEqual({ X: 2});
    });
});
describe('✅ getFirstNode()', () => {
    const FN = getFirstNode;
    it('should get the first child node', () => {
        expect(FN({some: { x: 3}})).toEqual({ x: 3});
    });
    it('should return empty object if its an empty object', () => {
        expect(FN({})).toEqual({});
    });
});
describe('✅ getFirstNodeProperty()', () => {
    const FN = getFirstNodeProperty;
    it('should get the property of the first child node', () => {
        expect(FN({some: { x: 3}}, 'x')).toBe(3);
    });
    it('should return undefined if the property does not exist', () => {
        expect(FN({some: { x: 3}}, 'y')).toBeUndefined();
    });
});
describe('✅ getFirstNodeContent()', () => {
    const FN = getFirstNodeContent;
    it('should get the property of the first child node', () => {
        const INPUT = {some: { content: 3}};
        expect(FN(INPUT)).toBe(3);
    });
    it('should return undefined if the property does not exist', () => {
        const INPUT = {some: { x: 3}};
        expect(FN(INPUT)).toBeUndefined();
    });
})
describe('✅ getKeyValue()', () => {
    const FN = getKeyValue;
    const KEY = {Key: {content: 'a'}};
    const VALUE = {Value: {content: 1}};
    const key = {key: {content: 'a'}};
    const value = {value: {content: 1}};
    
    it('should return the key value pair of the first two children', () => {
        expect(FN({ children: [KEY, VALUE]})).toEqual({a: 1});
        expect(FN({ children: [VALUE, KEY]})).toEqual({a: 1}); // wrong order
        expect(FN({ children: [key, value]})).toEqual(undefined); // wrong spelling
    });
    it('should return undefined if there are no children', () => {
        const spy = jest.spyOn(LOG, 'WARN');
        expect(FN({children: []})).toBeUndefined();
        expect(spy).toHaveBeenCalledWith('Node does not have enough children to extract key value pair');
    });
    it('should return undefined if there are not enough children', () => {
        const spy = jest.spyOn(LOG, 'WARN');
        expect(FN({children: [{Key: {content: 'a'}}]})).toBeUndefined();
        expect(spy).toHaveBeenCalledWith('Node does not have enough children to extract key value pair');
    });
});
describe('✅ getKeyList()', () => {
    const FN = getKeyList;
    const ITEM_1 = [{Key: {content: 'a'}}, {Value: {content: 1}}];
    const ITEM_2 = [{Key: {content: 'b'}}, {Value: {content: 2}}];
    const children = [
                    {
                        KeyValue: {
                            children: [...ITEM_1]
                        }
                    },
                    {
                        KeyValue: {
                            children: [...ITEM_2]
                        }
                    }
                ]
    it('should return the key list from node => children', () => {
        const INPUT = {
            keyList: {
                children
            }
        };
        expect(FN(INPUT)).toEqual({
            a: 1,
            b: 2
        });
    });
    it('should return the key list from children', () => {
        const INPUT = {
            children
        };
        expect(FN(INPUT)).toEqual({
            a: 1,
            b: 2
        });
    });
});
describe('✅ firstCharLowerCase()', () => {
    const FN = firstCharLowerCase;
    it('should lowercase the first char', () => {
        expect(FN('KEY')).toEqual('kEY');
        expect(FN('key')).toEqual('key');
        expect(FN('KeySet')).toEqual('keySet');
        expect(FN('keySet')).toEqual('keySet');
    });
})
describe('✅ getRef()', () => {
    const FN = getRef;
    it('should return the ref if it exists', () => {
        const INPUT = { myRef: {ref: 'test', MyVersionRef: 2}}
        expect(FN(INPUT)).toEqual({ ref: 'test', myVersion: 2 });
    });
    it('should return undefined if there is no ref', () => {
        expect(FN({})).toEqual({});
    });
});
describe('✅ checkMissingKeys()', () => {
    const FN = checkMissingKeys;
    it('should add no warning, when all keys are solved', () => {
        const logs: ParseLogs = new ParseLogs();
        FN([], 'mycontext', logs)
        expect(logs.getLogs()).toEqual([])
    });
    it('should add warning, when not all keys are solved', () => {
        const logs: ParseLogs = new ParseLogs();
        FN(['missingKey'], 'mycontext', logs)
        expect(logs.getWarnings()).toEqual([
            {
                message: '[mycontext] not fully processed',
                value: ['missingKey']
            }
        ])
    });
});

// TODO: getChildren
// TODO: getChildKeys
// TODO: getChildKeyIDs
// TODO: getID
// TODO: copy
// TODO: getRefValue

describe('iterateChildren()', () => {
    const FN = iterateChildren;
    it('should iterate over the children and return the content value', () => {
        const INPUT = [
                { TimeZone: { content: 'Europe/Berlin' } },
                { lorem: { content: 'ipsum' } },
            ];
        const EXPECTED = {
            timeZone: 'Europe/Berlin',
            lorem: 'ipsum',
        }
        const logs = new ParseLogs();
        const result = FN(INPUT, 'TimeZone', logs);
        expect(result).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([]);
    });
    it('should iterate over the children and return the content value', () => {
        const id = 'dbinfrago:8648530a-7d19-5ce5-875f-1edf5af46d0f';
        const INPUT = 
            [
            {
                AccessibilityLimitation: {
                id,
                children: [
                    { LiftFreeAccess: { content: 'true'} },
                ]
                }
            }
            ] ;
        const EXPECTED = {
            [id]: {
                liftFreeAccess: 'true'
            }
        }
        const logs = new ParseLogs();
        const result = FN(INPUT, 'AccessibilityLimitation', logs);
        expect(result).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([]);
    });
});

describe('getContentValueFromChilds()', () => {
    const FN = getContentValueFromChilds;
    it('should return the content value from basic child nodes', () => {
        const INPUT = {
            Locale: {
                id: 'xxx-123',
                version: '1234',
            }
        };
        const logs = new ParseLogs();
        const result = FN(INPUT, logs);
        expect(result).toEqual({
            // locale: {
                id: 'xxx-123',
                version: '1234',
            // }
        });
        expect(logs.getWarnings()).toEqual([]);
    });
    it('should return the content value from basic child nodes', () => {
        const INPUT = {
            Locale: {
                id: 'xxx-123',
                version: '1234',
                children: [
                    { TimeZone: { content: 'Europe/Berlin' } },
                ]
            }
        };
        const logs = new ParseLogs();
        const result = FN(INPUT, logs);
        expect(result).toEqual({
            // locale: {
                id: 'xxx-123',
                version: '1234',
                timeZone: 'Europe/Berlin'
            // }
        });
        expect(logs.getWarnings()).toEqual([]);
    });
    it('should return the content value from basic child nodes', () => {
        const INPUT = {
            Locale: {
                id: 'xxx-123',
                version: '1234',
                children: [
                    { TimeZone: { content: 'Europe/Berlin' } },
                    { Places: {
                        lorem: { content: 'ipsum' },
                        children: [
                            { From: { content: 'Berlin' } },
                            { To: { content: 'Munich' } }
                        ]
                    } }
                ]
            }
        };
        const logs = new ParseLogs();
        const result = FN(INPUT, logs);
        expect(result).toEqual({
            // locale: {
                id: 'xxx-123',
                version: '1234',
                timeZone: 'Europe/Berlin',
                places: {
                    lorem: 'ipsum',
                    from: 'Berlin',
                    to: 'Munich',
                }
            // }
        });
        expect(logs.getWarnings()).toEqual([]);
    });
    
    it('should return an empty array if there are no children', () => {
        const INPUT = {};
        const logs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual({});
        expect(logs.getWarnings()).toEqual([]);
    });
});