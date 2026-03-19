import { LOG } from '../../../../_shared/log/log';
import { Json } from '../../../../index.d';
import { ID, KEY, PROP, PROPS } from '../data_items/data_items.config';
import {
    addProperty,
    convertArray2Map,
    convertMap2Array,
    getArrayFromMap,
    getMapFromArray,
} from './data-convert';

const X = 3;
const id = `id-${X}`;
const FOO = `zz`;

describe('✅ getMapFromArray()', () => {
    const EMPTY: Json = {};
    const FN = getMapFromArray;
    const warnMSG = 'Item already has';
    let warnSpy: jest.SpyInstance;
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    it('✔️ 1. empty object converts to nothing', () => {
        expect(FN([])).toEqual({}); // nothing converts to empty
    });
    it('✔️ 2. convert simple object', () => {
        const RESULT = { id, X };
        const INPUT = [RESULT];
        expect(FN(INPUT)).toEqual(RESULT); // simple object
        expect(FN(INPUT, 'id')).toEqual({ [id]: RESULT, [PROPS]: [id] }); // idKey=id
        expect(FN(INPUT, 'FOO')).toEqual(EMPTY); // idKey=FOO
        expect(FN(INPUT, 'X')).toEqual({ [X]: RESULT, [PROPS]: [X] }); // idKey=X
    });
    it('✔️ 3. convert id object', () => {
        const y = { id, [PROP]: 'y' };
        const __props__ = ['y'];
        const RESULT = { y, X };
        expect(FN([RESULT])).toEqual(RESULT);
        expect(FN([{ id, [PROP]: 'y' }], 'id')).toEqual({ y, __props__ }); // X cannot be restored
        expect(FN([{ id }], 'id')).toEqual({ [id]: { id }, [PROPS]: [id] }); // X cannot be restored
        expect(FN([RESULT], 'FOO')).toEqual(EMPTY);
        expect(FN([RESULT], 'X')).toEqual({ [X]: RESULT, [PROPS]: [X] });
    });
    it('✔️ 4. convert FOO object', () => {
        const y = { FOO, [PROP]: 'y' };
        const __props__ = ['y'];
        const RESULT = { y: { FOO }, X };
        expect(FN([RESULT])).toEqual(RESULT);
        expect(FN([RESULT], 'id')).toEqual(EMPTY); // TODO: soll?
        expect(FN([RESULT], 'X')).toEqual({ [X]: RESULT, [PROPS]: [X] });
        expect(FN([{ FOO, [PROP]: 'y' }], 'FOO')).toEqual({ y, __props__ }); // X cannot be restored
    });
    it('✔️ 5. convert array of primitives', () => {
        const INPUT = [{ y: [id], X }];
        const RESULT = { y: [id], X, [PROPS]: ['y', 'X'] };
        expect(FN(INPUT)).toEqual(RESULT);
        expect(FN(INPUT, 'id')).toEqual(EMPTY);
        expect(FN(INPUT, 'FOO')).toEqual(EMPTY);
        expect(FN(INPUT, 'X')).toEqual(RESULT);
    });
    it('⚠️ 6. convert array of id objects', () => {
        const RESULT = { y: [{ id }], X };
        const __props__ = ['y'];
        const meta = { [PROP]: 'y' };
        expect(FN([RESULT])).toEqual(RESULT);
        expect(FN([{ id, [PROP]: 'y' }], 'id')).toEqual({
            y: { id, ...meta },
            __props__,
        }); // TODO: restore array with __type__ ?
        expect(FN([RESULT], 'FOO')).toEqual(EMPTY);
        expect(FN([RESULT], 'X')).toEqual(RESULT);
    });
    it('⚠️ 7. convert array of FOO objects', () => {
        const meta = { [PROP]: 'y' };
        const RESULT = { y: [{ FOO }], X };
        const __props__ = ['y'];
        expect(FN([RESULT])).toEqual(RESULT);
        expect(FN([RESULT], 'id')).toEqual(EMPTY);
        expect(FN([{ FOO, ...meta }], 'FOO')).toEqual({
            y: { FOO, ...meta },
            __props__,
        }); // TODO: restore array with __type__ ?
        expect(FN([RESULT], 'X')).toEqual(RESULT);
    });
    it('⚠️ 8. convert array of multiple objects', () => {
        const input = [
            { id, [PROP]: 'y' },
            { FOO, [PROP]: 'z' },
        ];
        const RESULT = { y: { id }, z: { FOO }, [PROPS]: ['y', 'z'] };
        expect(FN([RESULT])).toEqual(RESULT);
        expect(FN(input, 'id')).toEqual({
            y: { id, [PROP]: 'y' },
            [PROPS]: ['y'],
        }); // TODO: restore array with __type__ ?
        expect(FN(input, 'FOO')).toEqual({
            z: { FOO, [PROP]: 'z' },
            [PROPS]: ['z'],
        });
        expect(FN([RESULT], 'X')).toEqual(EMPTY);
    });
    it('✔️ 10a. not overwrite existing entries', () => {
        const prop = 'y';
        const input = [
            { id, [PROP]: prop },
            { id, X, [PROP]: prop },
        ];
        const item = JSON.stringify(input[0]);
        const RESULT = { [prop]: { id, [PROP]: prop }, [PROPS]: [prop] };
        expect(FN(input, 'id')).toEqual(RESULT);
        expect(warnSpy).toHaveBeenCalledWith(`${warnMSG} ${prop}: ${item}`);
    });
    it('✔️ 10b. not overwrite existing entries', () => {
        const prop = id;
        const input = [{ id }, { id, X }];
        const item = JSON.stringify(input[0]);
        const RESULT = { [prop]: { id }, [PROPS]: [prop] };
        expect(FN(input, 'id')).toEqual(RESULT);
        expect(warnSpy).toHaveBeenCalledWith(`${warnMSG} ${prop}: ${item}`);
    });
    it('✔️ 10c. not overwrite existing entries', () => {
        const prop = id;
        const input = [{ id, X }, { id }];
        const item = JSON.stringify(input[0]);
        const RESULT = { [prop]: { id, X }, [PROPS]: [prop] };
        expect(FN(input, 'id')).toEqual(RESULT);
        expect(warnSpy).toHaveBeenCalledWith(`${warnMSG} ${prop}: ${item}`);
    });
});

describe('✅ getArrayFromMap()', () => {
    const EMPTY: any[] = [];
    const FN = getArrayFromMap;
    it('✔️ 1. empty object converts to nothing', () => {
        expect(FN({})).toEqual([]); // nothing converts to empty
    });
    it('✔️ 2. convert simple object', () => {
        const INPUT = { id, X };
        expect(FN(INPUT)).toEqual([INPUT]); // simple object
        expect(FN(INPUT, 'id')).toEqual([INPUT]); // idKey=id
        expect(FN(INPUT, 'FOO')).toEqual(EMPTY); // idKey=FOO
        expect(FN(INPUT, 'X')).toEqual([INPUT]); // idKey=X
    });
    it('✔️ 3. convert id object', () => {
        const INPUT = { y: { id }, X }; // y: { id: ... }
        expect(FN(INPUT)).toEqual([INPUT]);
        expect(FN(INPUT, 'id')).toEqual([{ id, [PROP]: 'y' }]); // extracted
        expect(FN(INPUT, 'FOO')).toEqual(EMPTY);
        expect(FN(INPUT, 'X')).toEqual([INPUT]);
    });
    it('✔️ 4. convert FOO object', () => {
        const INPUT = { y: { FOO }, X }; // y: { FOO: ... }
        expect(FN(INPUT)).toEqual([INPUT]);
        expect(FN(INPUT, 'id')).toEqual(EMPTY);
        expect(FN(INPUT, 'FOO')).toEqual([{ FOO, [PROP]: 'y' }]); // extracted
        expect(FN(INPUT, 'X')).toEqual([INPUT]);
    });
    it('✔️ 5. convert array of primitives', () => {
        const INPUT = { y: [id], X }; // y: [ primitive ]
        expect(FN(INPUT)).toEqual([INPUT]);
        expect(FN(INPUT, 'id')).toEqual(EMPTY);
        expect(FN(INPUT, 'FOO')).toEqual(EMPTY);
        expect(FN(INPUT, 'X')).toEqual([INPUT]);
    });
    it('⚠️ 6. convert array of id objects', () => {
        const INPUT = { y: [{ id }], X }; // y: [ { id: ... } ]
        expect(FN(INPUT)).toEqual([INPUT]);
        expect(FN(INPUT, 'id')).toEqual([{ id, [PROP]: 'y' }]); // extracted // TODO:  eher  [{ y:[{ id }] }]
        expect(FN(INPUT, 'FOO')).toEqual(EMPTY);
        expect(FN(INPUT, 'X')).toEqual([INPUT]);
    });
    it('⚠️ 7. convert array of FOO objects', () => {
        const INPUT = { y: [{ FOO }], X };
        expect(FN(INPUT)).toEqual([INPUT]); // y: [ { FOO: ... } ]
        expect(FN(INPUT, 'id')).toEqual(EMPTY);
        expect(FN(INPUT, 'FOO')).toEqual([{ FOO, [PROP]: 'y' }]); // extracted //TODO: eher  [{ y:[{ FOO }] }]
        expect(FN(INPUT, 'X')).toEqual([INPUT]);
    });
});
describe('✅ addProperty()', () => {
    const FN = addProperty;
    let warnSpy: jest.SpyInstance;
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    it('should add new property', () => {
        expect(FN({}, 'foo', 'value')).toEqual({ foo: 'value' });
        expect(FN({}, 'foo', 33)).toEqual({ foo: 33 });
        expect(FN({ ba: 3 }, 'foo', 'value')).toEqual({ foo: 'value', ba: 3 });
    });
    it('should not add new property if it exists', () => {
        const key = 'ba';
        const val = 3;
        expect(FN({ [key]: val }, 'ba', 'nValue')).toEqual({ [key]: val });
        expect(warnSpy).toHaveBeenCalledWith(`Item already has ${key}: ${val}`);
    });
    it('should add new property and track it in props array', () => {
        const props: string[] = [];
        expect(FN({}, 'foo', 'value', props)).toEqual({ foo: 'value' });
        expect(props).toEqual(['foo']);
        expect(FN({}, 'bar', 33, props)).toEqual({ bar: 33 });
        expect(props).toEqual(['foo', 'bar']);
    });
});

describe('convertMap2Array()', () => {
    const FN = convertMap2Array;
    let warnSpy: jest.SpyInstance;
    const MSG = 'Item already has ';
    const foo = { id };
    const bar = { id };
    const FOO_BAR_id = { foo, bar };
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    it('convert map with specific id', () => {
        expect(FN({ FOO }, 'FOO')).toEqual([{ FOO, [ID]: FOO, [KEY]: 'FOO' }]);
        expect(FN({ FOO }, 'x')).toEqual([]);
        expect(FN({ FOO, X }, 'X')).toEqual([{ FOO, X, [ID]: X, [KEY]: 'X' }]);
    });
    it('convert map without specific id', () => {
        expect(FN({ FOO })).toEqual([{ FOO }]);
    });
    it('convert multiple map with id', () => {
        const items = [
            { id, [PROP]: 'foo' },
            { id, [PROP]: 'bar' },
        ];
        expect(FN(FOO_BAR_id, 'id')).toEqual(items);
    });
    it('convert multiple map without id', () => {
        expect(FN(FOO_BAR_id)).toEqual([{ foo, bar }]);
    });
    it('convert map with meta KEY properties', () => {
        expect(FN({ FOO, [KEY]: 'abc' }, 'FOO')).toEqual([
            { FOO, [ID]: FOO, [KEY]: 'abc' },
        ]);
        expect(warnSpy).toHaveBeenCalledWith(`${MSG}${KEY}: abc`);
    });
    it('convert map with meta ID properties', () => {
        expect(FN({ FOO, [ID]: 'abc' }, 'FOO')).toEqual([
            { FOO, [ID]: 'abc', [KEY]: 'FOO' },
        ]);
        expect(warnSpy).toHaveBeenCalledWith(`${MSG}${ID}: abc`);
    });
});
describe('convertArray2Map()', () => {
    const FN = convertArray2Map;
    it('1. convert simple array', () => {
        expect(FN([])).toEqual({});
        expect(FN([{ FOO }], 'x')).toEqual({});
        expect(FN([{ FOO }])).toEqual({ FOO, [PROPS]: ['FOO'] });
        expect(FN([{ FOO }, { X }])).toEqual({ FOO, X, [PROPS]: ['FOO', 'X'] });
        // expect(FN([{ FOO, X }, { X }])).toEqual({ FOO, X, [PROPS]: ['FOO', 'X'] });
    });
    it('2. convert simple array with prop', () => {
        expect(FN([{ FOO, [PROP]: 'foo' }], 'FOO')).toEqual({
            foo: { FOO, [PROP]: 'foo' },
            [PROPS]: ['foo'],
        });
        expect(FN([{ FOO, X, [PROP]: 'bar' }], 'X')).toEqual({
            bar: { FOO, X, [PROP]: 'bar' },
            [PROPS]: ['bar'],
        });
        expect(FN([{ FOO, X, [PROP]: 'bar', [KEY]: 'abc' }], 'X')).toEqual({
            bar: { FOO, X, [PROP]: 'bar', [KEY]: 'abc' },
            [PROPS]: ['bar'],
        });
    });
    it('3. convert Array with multiple object item', () => {
        // multiple items
        const MULTIPLE_INPUT = [
            { FOO, X, [PROP]: 'bar', [KEY]: 'abc' },
            { FOO, X, [PROP]: 'lorem', [KEY]: 'abc' },
        ];
        expect(FN(MULTIPLE_INPUT, 'X')).toEqual({
            bar: { FOO, X, [PROP]: 'bar', [KEY]: 'abc' },
            lorem: { FOO, X, [PROP]: 'lorem', [KEY]: 'abc' },
            [PROPS]: ['bar', 'lorem'],
        });
        expect(FN(MULTIPLE_INPUT)).toEqual({
            bar: { FOO, X, [PROP]: 'bar', [KEY]: 'abc' },
            lorem: { FOO, X, [PROP]: 'lorem', [KEY]: 'abc' },
            [PROPS]: ['bar', 'lorem'],
        });
        expect(FN([{ X }, { FOO }])).toEqual({ X, FOO, [PROPS]: ['X', 'FOO'] }); // TODO: how to handle multiple items with same prop? -> add __props__ array with all props? // TODO: how to handle multiple items with same prop and id? -> add __id__ to each item and __props__ array with all props? // TODO: how to handle multiple items with same prop and id and key? -> add __id__ and __key__ to each item and __props__ array with all props? // TODO: how to handle multiple items with same prop and id and key and other meta? -> add all meta to each item and __props__ array with all props?
        // expect(FN([{ X, [ID]: 'f' }, { FOO }])).toEqual({ { X, [ID]: 'f'}, FOO }); // TODO: how?
    });
});
