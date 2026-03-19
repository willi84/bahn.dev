import * as mock from 'mock-fs';
import {
    convertData,
    getFallBackByType,
    getIssues,
    getItemListFromFile,
    getItemMapFromFile,
    getItemsByAPI,
    getTotalFromMap,
    loadItems,
    normalizeData,
    proceedItems,
    readDataFromFile,
} from './data_items';
import { LOG } from '../../../../_shared/log/log';
import { mockServiceUnavailable, spyOnCMD } from '../../_shared/utils/utils';
import { getMockItems } from '../../civic_issues/civic_issues.mock';
import {
    DATA_CONFIG,
    DATA_ITEMS,
    DATA_MAP,
    DATA_MODE,
    DATA_TYPE,
    DATA_TYPES,
    SAMPLE_DATA,
} from '../endpoints.d';
import { ENDPOINT_CONFIG_CIVIC_ISSUES } from '../../civic_issues/civic_issues.config';
import { CIVIC_ISSUE_ITEM } from '../../civic_issues/civic_issues.d';
import { Json } from '../../../../index.d';
import {
    FAKE_LIST_RESULT_1,
    FAKE_LIST_RESULT_2,
    FAKE_LIST_RESULT_3,
    FAKE_LIST_RESULT_FALLBACK,
    FAKE_MAP_RESULT_1,
    FAKE_MAP_RESULT_2,
    FAKE_MAP_RESULT_3,
    FAKE_MAP_RESULT_FALLBACK,
} from '../../_shared/utils/utils.mock';
import {
    FALLBACK_LIST,
    FALLBACK_MAP,
    ID,
    KEY,
    PROP,
    PROPS,
} from './data_items.config';
import {
    ENDPOINT_CONFIG,
    MOCK_DATA,
    SAMPLE_LIST,
    SAMPLE_MAP,
} from './data_items.d';
import {
    ENDPOINT_CONFIG_SAMPLE_LIST,
    ENDPOINT_CONFIG_SAMPLE_MAP,
} from '../../_shared/utils/utils.config';
import { MOCK_ADDRESS_ITEMS } from '../geo/geo.mock';
import { PLACE } from '../geo/geo.d';
import { ENDPOINT_CONFIG_NOMINATIM } from '../geo/geo.config';
import {
    convertArray2Map,
    convertMap2Array,
} from '../data-convert/data-convert';

// type SAMPLE_MAP = DATA_MAP<SAMPLE_DATA>;
// type SAMPLE_LIST = DATA_ITEMS<SAMPLE_DATA>;

const warnMSG = 'Item already has';

const createMockFiles = (data: MOCK_DATA, key: string): Json => {
    const demoPath = `src/_data/raw/${key}_demo.json`;
    const cachePath = `src/_data/raw/${key}_cache.json`;
    return {
        [demoPath]: JSON.stringify(data.demo),
        [cachePath]: JSON.stringify(data.cache),
    };
};
describe('getTotalFromMap()', () => {
    const FN = getTotalFromMap;
    const x = 'foo';
    it('should return total number of items in map', () => {
        expect(FN({})).toEqual(0);
        expect(FN({ a: 1, b: 2 })).toEqual(2);
        expect(FN({ a: { x, [PROP]: 'lorem' }, b: 2 })).toEqual(1);
        expect(
            FN({ a: { x, [PROP]: 'lorem' }, b: { x, [PROP]: 'ipsum' } })
        ).toEqual(2);
        expect(FN({ x, [PROP]: 'lorem' })).toEqual(1);
    });
});

describe('CONVERT', () => {
    // const NAME_1 = { name: 'Item 1' };
    // const NAME_2 = { name: 'Item 2' };
    // const NAME_3 = { name: 'Item 3' };
    // const _ITEM_1 = { id: 1, ...NAME_1 };
    // const _ITEM_1a = { id: 1, ...NAME_2 };
    // const _ITEM_2 = { id: 2, ...NAME_2 };
    // const _ITEM_3 = { id: 3, ...NAME_3 };

    let warnSpy: jest.SpyInstance;
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    const addAlternateID = (x: any, y?: any, z?: any) => {};
    xdescribe(' addAlternateID()', () => {
        const FN = addAlternateID;
        const ALT_ID = 'custom_key_1';
        const EXISTING_ID = 'existing_id_1';
        const x = 'foobar';
        const key = 'x';
        const value = x;
        const undef = 'undefined';
        // const name = { name: 'foobar' };
        it('should add alternate id when no id exists', () => {
            const input = { x };
            expect(FN(input, 'x')).toEqual({ x, [ID]: value, [KEY]: key });
            expect(FN(input)).toEqual({ x, [ID]: undef });
            expect(FN(input, 'y')).toEqual({ x, [ID]: undef });

            expect(FN(input, '', 'name')).toEqual({ x, [ID]: x });
            expect(FN(input, ALT_ID, 'name')).toEqual({ x, [ID]: x });
            expect(FN(input, ALT_ID)).toEqual({ x, [ID]: ALT_ID });
        });
        it('should not add alternate id when id exists', () => {
            const input = { id: 99, x };
            const result = FN(input, ALT_ID);
            expect(result).toEqual({ id: 99, x });
        });
        it('should not add alternate id when idKey exists', () => {
            const input = { idx: 99, x };
            const result = FN(input, ALT_ID, 'idx');
            expect(result).toEqual({ idx: 99, x });
        });
        it('should add alternate id if idKey is empty', () => {
            const input = { idx: 99, x };
            const result = FN(input, ALT_ID, '');
            expect(result).toEqual({ ...input, [ID]: ALT_ID, [KEY]: ALT_ID });
        });
        it('should not add alternate id but original key if given', () => {
            const input = { id: 99, x };
            const result = FN(input, ALT_ID, '');
            expect(result).toEqual({ ...input, [KEY]: ALT_ID });
        });
        it('should not add alternate id if key not given', () => {
            const input = { id: 99, x };
            expect(FN(input)).toEqual({ id: 99, x });
        });
        it('should not overwrite existing __id__', () => {
            const input = { x, [ID]: EXISTING_ID };
            expect(FN(input, ALT_ID)).toEqual({ x, [ID]: EXISTING_ID });
            expect(warnSpy).toHaveBeenCalledWith(
                `Item already has ${ID}: ${EXISTING_ID}`
            );
        });
    });
    xdescribe('✅ addAlternateID()', () => {
        const FN = addAlternateID;
        const ALT_ID = 'custom_key_1';
        const EXISTING_ID = 'existing_id_1';
        const x = 'foobar';
        const id = 'myid';
        const UNDEF = 'undefined';
        const key = 'x';
        const value = x;
        const undef = 'undefined';
        // const name = { name: 'foobar' };
        it('should add alternate id when no id exists', () => {
            const input = { x };
            expect(FN(input)).toEqual({ x, [ID]: undef });
            expect(FN(input, 'x')).toEqual({ x, [ID]: value, [KEY]: key });
            expect(FN(input, 'y')).toEqual({ x, [ID]: undef });

            expect(FN(input, '', 'name')).toEqual({ x, [ID]: x });
            expect(FN(input, ALT_ID, 'name')).toEqual({ x, [ID]: x });
            expect(FN(input, ALT_ID)).toEqual({ x, [ID]: ALT_ID });
        });
        it('should not add alternate id when id exists', () => {
            const input = { id: 99, x };
            const result = FN(input, ALT_ID);
            expect(result).toEqual({ id: 99, x });
        });
        it('should not add alternate id when idKey exists', () => {
            const input = { idx: 99, x };
            const result = FN(input, ALT_ID, 'idx');
            expect(result).toEqual({ idx: 99, x });
        });
        it('should add alternate id if idKey is empty', () => {
            const input = { idx: 99, x };
            const result = FN(input, ALT_ID, '');
            expect(result).toEqual({ ...input, [ID]: ALT_ID, [KEY]: ALT_ID });
        });
        it('should not add alternate id but original key if given', () => {
            const input = { id: 99, x };
            const result = FN(input, ALT_ID, '');
            expect(result).toEqual({ ...input, [KEY]: ALT_ID });
        });
        it('should not add alternate id if key not given', () => {
            const input = { id: 99, x };
            expect(FN(input)).toEqual({ id: 99, x });
        });
        it('should not overwrite existing __id__', () => {
            const input = { x, [ID]: EXISTING_ID };
            expect(FN(input, ALT_ID)).toEqual({ x, [ID]: EXISTING_ID });
            expect(warnSpy).toHaveBeenCalledWith(
                `Item already has ${ID}: ${EXISTING_ID}`
            );
        });
    });
});
describe('✅ convertMap2Array()', () => {
    const FN = convertMap2Array<any>;
    // values
    const warn = `Item already has`;
    const FALLBACK: any[] = [];
    const id = 'foobar';
    const x = 'blubber';
    const ID_OTHER = 'undefined';
    const CUSTOM_ID = 'custom_id_1';
    const UD = 'undefined';
    const CS = 'custom_id_1';
    // const name = { name: 2 }; // TODO: hebelt aus
    // input
    const MAP = { id };
    const MAP_ID = { id };
    const MAP_X = { x };
    const MAP_IDX = { id, x };
    const MAP_X_CUSTOM_ID = { x, [ID]: CUSTOM_ID };
    const MAP_ID_IDX_X: Json = { MAP_ID, MAP_IDX, MAP_X };
    const ITEM_ID = { id: 'foobar', name: 2 };
    const ITEM_IDX = { idx: 'foobar', name: 3 };
    // shortcusts
    const __key__ = ID_OTHER;

    // results
    const EMPTY: Json = {};
    const ARR_X = [{ x }];
    const ARR_PRIM = ['1', 2, false];
    const ARR_ID = [{ id }];
    const ARR_MIX = [{ x }, { id }];
    const WARN_ID = `${warn} ${ID}`;
    const WARN_KEY = `${warn} ${KEY}`;

    const RES_ITEM_IDX_ID = { id, x, [PROP]: 'MAP_IDX' };
    const RES_ITEM_IDX_X = { id, x, [PROP]: 'MAP_IDX', [ID]: x, [KEY]: 'x' };
    const RES_ITEM_ID = { id, [PROP]: 'MAP_ID' };
    const ITEM_MAP_X = { x, [PROP]: 'MAP_X', [ID]: x, [KEY]: 'x' };
    let warnSpy: jest.SpyInstance;
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    describe('idKey=<>', () => {
        it('convert simple items to single array item', () => {
            expect(FN(EMPTY)).toEqual(FALLBACK);

            // 👉 map objects with id => directly converted
            expect(FN({ id })).toEqual([{ id }]);
            expect(FN({ id, x })).toEqual([{ id, x }]);
            expect(FN({ x })).toEqual([{ x }]);

            // 👉 existing custom id
            expect(FN({ x, [ID]: UD })).toEqual([{ x, [ID]: UD }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_ID}: ${UD}`);

            expect(FN({ x, [ID]: CS })).toEqual([{ x, [ID]: CS }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_ID}: ${CS}`);

            expect(FN({ x, __key__ })).toEqual([{ x, __key__ }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_KEY}: ${__key__}`);
        });
        it('convert different map objects (without id) FULLY to 1 array item', () => {
            // 👉 MAP_ID = { id }
            expect(FN({ MAP_ID, id })).toEqual([{ MAP_ID, id }]);
            expect(FN({ MAP_ID })).toEqual([{ MAP_ID }]);
            // 👉 MAP_ID_X = { id, x } [not id only]
            expect(FN({ MAP_IDX, id })).toEqual([{ MAP_IDX, id }]);
            expect(FN({ MAP_IDX })).toEqual([{ MAP_IDX }]);
            // 👉 MAP_X = { x }
            expect(FN({ MAP_X, id })).toEqual([{ MAP_X, id }]);
            expect(FN({ MAP_X })).toEqual([{ MAP_X }]);
            // 👉 MAP_123 = { MAP_ID, MAP_ID_X, MAP_X }
            expect(FN(MAP_ID_IDX_X)).toEqual([MAP_ID_IDX_X]);
        });
        it('convert different array objects to same array item', () => {
            // 👉 x objects [{x}]
            expect(FN({ ARR_X, id })).toEqual([{ ARR_X, id }]);
            expect(FN({ ARR_X })).toEqual([{ ARR_X }]);
            // 👉 primitive values [str, num, bool]
            expect(FN({ ARR_PRIM, id })).toEqual([{ ARR_PRIM, id }]);
            expect(FN({ ARR_PRIM })).toEqual([{ ARR_PRIM }]);
            // 👉 id objects [{id}]
            expect(FN({ ARR_ID, id })).toEqual([{ ARR_ID, id }]);
            expect(FN({ ARR_ID })).toEqual([{ ARR_ID }]);
            // 👉 mixed objects [{x}, {id}]
            expect(FN({ ARR_MIX, id })).toEqual([{ ARR_MIX, id }]);
            expect(FN({ ARR_MIX })).toEqual([{ ARR_MIX }]);
            // TODO: complex map
        });
        it('convert complex objects', () => {
            // 👉 different properties (MAP_ID: {}, MAP_ID_X: {})
            expect(FN({ MAP_ID, MAP_IDX })).toEqual([{ MAP_ID, MAP_IDX }]);
            expect(FN({ MAP_ID, z: 3 })).toEqual([{ MAP_ID, z: 3 }]);

            // 👉 x/y with different values
            const A = MAP;
            const B = MAP_IDX;
            expect(FN({ x: [A], y: [A] })).toEqual([{ x: [A], y: [A] }]); // same
            expect(FN({ x: [A], y: [B] })).toEqual([{ x: [A], y: [B] }]);
            expect(FN({ x: [A], y: 3 })).toEqual([{ x: [A], y: 3 }]);
        });
        it('converts map with partly custom_id', () => {
            const INPUT: Json = { MAP_X, z: { x, [ID]: CS } };
            const EXPECTED = [INPUT];
            const result = FN(INPUT);
            expect(result).toEqual(EXPECTED);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_ID}: ${CS}`);
        });
    });
    describe('idKey=id', () => {
        const key = 'id';
        it('convert simple items to single array item', () => {
            expect(FN(EMPTY, key)).toEqual(FALLBACK);

            // 👉 map objects with idKey => directly converted
            expect(FN({ x }, key)).toEqual([]);
            expect(FN({ id }, key)).toEqual([{ id }]);
            expect(FN({ id, x }, key)).toEqual([{ id, x }]);

            // 👉 existing custom id
            expect(FN({ id, [ID]: UD }, key)).toEqual([{ id, [ID]: UD }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_ID}: ${UD}`);

            expect(FN({ id, [ID]: CS }, key)).toEqual([{ id, [ID]: CS }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_ID}: ${CS}`);

            expect(FN({ id, __key__ }, key)).toEqual([{ id, __key__ }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_KEY}: ${__key__}`);
        });
        it('convert different map objects to array item(s)', () => {
            // 👉 MAP_ID = { id }
            expect(FN({ MAP_ID, id }, key)).toEqual([{ MAP_ID, id }]);
            expect(FN({ MAP_ID }, key)).toEqual([RES_ITEM_ID]);
            // 👉 MAP_ID_X = { id, x } [not id only]
            expect(FN({ MAP_IDX, id }, key)).toEqual([{ MAP_IDX, id }]);
            expect(FN({ MAP_IDX }, key)).toEqual([RES_ITEM_IDX_ID]);
            // 👉 MAP_X = { x }
            expect(FN({ MAP_X, id }, key)).toEqual([{ MAP_X, id }]);
            expect(FN({ MAP_X }, key)).toEqual([]);
            // 👉 MAP_123 = { MAP_ID, MAP_ID_X, MAP_X }
            const result = [RES_ITEM_ID, RES_ITEM_IDX_ID];
            expect(FN(MAP_ID_IDX_X, key)).toEqual(result);
        });
        it('convert different array objects', () => {
            // 👉 x objects [{x}]
            expect(FN({ ARR_X, id }, key)).toEqual([{ ARR_X, id }]);
            expect(FN({ ARR_X }, key)).toEqual([]);
            // 👉 primitive values [str, num, bool]
            expect(FN({ ARR_PRIM, id }, key)).toEqual([{ ARR_PRIM, id }]);
            expect(FN({ ARR_PRIM }, key)).toEqual([]);
            // 👉 id objects [{id}]
            expect(FN({ ARR_ID, id }, key)).toEqual([{ ARR_ID, id }]);
            expect(FN({ ARR_ID }, key)).toEqual([{ id, [PROP]: 'ARR_ID' }]);
            // 👉 mixed objects [{x}, {id}]
            expect(FN({ ARR_MIX, id }, key)).toEqual([{ ARR_MIX, id }]);
            expect(FN({ ARR_MIX }, key)).toEqual([{ id, [PROP]: 'ARR_MIX' }]);
        });
        it('convert complex objects', () => {
            // 👉 different properties (MAP_ID: {}, MAP_ID_X: {})
            const result = [RES_ITEM_ID, RES_ITEM_IDX_ID];
            expect(FN({ MAP_ID, MAP_IDX }, key)).toEqual(result);
            expect(FN({ MAP_ID, z: 3 }, key)).toEqual([RES_ITEM_ID]); // filter out unnecessary items

            // 👉 x/y with different values
            const A = MAP;
            const B = MAP_IDX;
            const R_X_ID = { id, [PROP]: 'x' };
            const R_Y_ID = { id, [PROP]: 'y' };
            const R_Y_ID_X = { id, x, [PROP]: 'y' };
            expect(FN({ x: [A], y: [A] }, key)).toEqual([R_X_ID, R_Y_ID]); // same
            expect(FN({ x: [A], y: [B] }, key)).toEqual([R_X_ID, R_Y_ID_X]);
            expect(FN({ x: [A], y: 3 }, key)).toEqual([R_X_ID]);
        });
        it('converts map with partly custom_id', () => {
            const INPUT: Json = { MAP_X, z: { id, [ID]: CS } };
            expect(FN(INPUT, key)).toEqual([{ id, [PROP]: 'z', [ID]: CS }]);
            expect(warnSpy).not.toHaveBeenCalledWith(`${WARN_ID}: ${CS}`);
        });
        // TODO: input= { MAP_X, z: { x, [ID]: CS } };
    });
    describe('idKey=x', () => {
        const key = 'x';
        const ID_KEY = { [ID]: x, [KEY]: key };
        const ID_UD_KEY = { [ID]: UD, [KEY]: key };
        const ID_CS_KEY = { [ID]: CS, [KEY]: key };
        const ID_KEY_UD = { [ID]: x, [KEY]: UD };
        it('convert simple items id to single array item', () => {
            expect(FN(EMPTY, key)).toEqual(FALLBACK);
            // 👉 map objects with idKey => directly converted
            expect(FN({ x }, key)).toEqual([{ x, ...ID_KEY }]);
            expect(FN({ id }, key)).toEqual([]);
            expect(FN({ id, x }, key)).toEqual([{ id, x, ...ID_KEY }]);

            expect(FN({ x, [ID]: UD }, key)).toEqual([{ x, ...ID_UD_KEY }]);
            expect(warnSpy).toHaveBeenCalledWith(`${WARN_ID}: ${UD}`);

            expect(FN({ x, [ID]: CS }, key)).toEqual([{ x, ...ID_CS_KEY }]);
            expect(warnSpy).toHaveBeenCalledWith(`${WARN_ID}: ${CS}`);

            expect(FN({ x, __key__ }, key)).toEqual([{ x, ...ID_KEY_UD }]);
            expect(warnSpy).toHaveBeenCalledWith(`${WARN_KEY}: ${UD}`);
        });

        it('convert different map objects to array item(s)', () => {
            const ID_KEY = { [ID]: x, [KEY]: key };
            const RESULT = { x, ...ID_KEY };
            const RESULT_X = { x, ...ID_KEY, [PROP]: 'MAP_X' };
            const RESULT_IDX = { x, id, ...ID_KEY, [PROP]: 'MAP_IDX' };
            // 👉 MAP_ID = { id }
            expect(FN({ MAP_ID, id }, key)).toEqual([]);
            expect(FN({ MAP_ID }, key)).toEqual([]);
            expect(FN({ MAP_ID, x }, key)).toEqual([{ MAP_ID, ...RESULT }]);
            // 👉 MAP_ID_X = { id, x } [not id only]
            expect(FN({ MAP_IDX, id }, key)).toEqual([RESULT_IDX]);
            expect(FN({ MAP_IDX }, key)).toEqual([RESULT_IDX]);
            // 👉 MAP_X = { x }
            expect(FN({ MAP_X, id }, key)).toEqual([RESULT_X]);
            expect(FN({ MAP_X, x }, key)).toEqual([{ ...RESULT, MAP_X }]);
            expect(FN({ MAP_X }, key)).toEqual([RESULT_X]);
            // 👉 MAP_123 = { MAP_ID, MAP_ID_X, MAP_X }
            expect(FN(MAP_ID_IDX_X, key)).toEqual([RES_ITEM_IDX_X, ITEM_MAP_X]);
        });
        it('convert different array objects', () => {
            let id = 'ARR_X';
            // 👉 x objects
            const RESULT = { x, ...ID_KEY };
            expect(FN({ ARR_X, id }, key)).toEqual([{ ...RESULT, [PROP]: id }]);
            expect(FN({ ARR_X }, key)).toEqual([{ ...RESULT, [PROP]: id }]);
            // 👉 primitive values
            expect(FN({ ARR_PRIM, x }, key)).toEqual([{ ...RESULT, ARR_PRIM }]);
            expect(FN({ ARR_PRIM }, key)).toEqual([]);
            // 👉 id objects
            expect(FN({ ARR_ID, x }, key)).toEqual([{ ...RESULT, ARR_ID }]);
            expect(FN({ ARR_ID }, key)).toEqual([]);
            // 👉 mixed objects
            id = 'ARR_MIX';
            expect(FN({ ARR_MIX, x }, key)).toEqual([{ ...RESULT, ARR_MIX }]);
            expect(FN({ ARR_MIX }, key)).toEqual([{ ...RESULT, [PROP]: id }]);
            // TODO: complex map
        });
        it('convert complex objects', () => {
            // 👉 different properties (MAP_ID: {}, MAP_ID_X: {})
            // const result = [K_MAP_X, K_MAP_ID_X];
            const item_x = { x, ...ID_KEY };
            const item_idx = { id, x, ...ID_KEY };
            const result = [
                { ...item_x, [PROP]: 'MAP_X' },
                { ...item_idx, [PROP]: 'MAP_IDX' },
            ];
            expect(FN({ MAP_X, MAP_IDX }, key)).toEqual(result);
            expect(FN({ MAP_X, MAP_IDX, z: 3 }, key)).toEqual(result); // filter out unnecessary items

            // 👉 x/y with different values
            const RESULT_Z = { ...item_x, [PROP]: 'z' };
            const RESULT_SAME = [RESULT_Z, { ...item_x, [PROP]: 'y' }];
            const RESULT_MIX = [RESULT_Z, { ...item_idx, [PROP]: 'y' }];
            expect(FN({ z: [MAP_X], y: [MAP_X] }, key)).toEqual(RESULT_SAME); // same map objects
            expect(FN({ z: [MAP_X], y: [MAP_IDX] }, key)).toEqual(RESULT_MIX);
            expect(FN({ z: [MAP_X], y: 3333 }, key)).toEqual([RESULT_Z]);
        });
        it('converts map with partly custom_id', () => {
            const INPUT: Json = { MAP_X, MAP_X_CUSTOM_ID };
            const item_x = { x, ...ID_KEY };
            const EXPECTED = [
                { ...item_x, [PROP]: 'MAP_X' },
                { ...item_x, [PROP]: 'MAP_X_CUSTOM_ID', [ID]: CS },
            ];
            const result = FN(INPUT, key);
            expect(result).toEqual(EXPECTED);
            expect(warnSpy).toHaveBeenCalledWith(
                `Item already has ${ID}: ${CUSTOM_ID}`
            );
        });
    });
    xdescribe('with idKey defined', () => {
        describe('1st level', () => {
            it('should convert map as single item [idKey=1st level]', () => {
                const MAP = { ...ITEM_ID };
                const EXPECTED = [{ ...MAP }];
                const result = FN(MAP, 'id');
                expect(result).toEqual(EXPECTED);
            });
            it('no item with id found [idKey=1st level]', () => {
                const MAP = { ...ITEM_IDX };
                const result = FN(MAP, 'id');
                expect(result).toEqual(FALLBACK);
            });
        });
        describe('2nd level', () => {
            it('should convert map as single item [idKey=2nd level], no 2nd item with id found', () => {
                const MAP = { xx: { ...ITEM_ID }, yy: {} };
                const EXPECTED = [{ ...MAP.xx }];
                const result = FN(MAP, 'id');
                expect(result).toEqual(EXPECTED);
            });
            it('should xxx', () => {
                const MAP = { xx: [{ ...ITEM_ID }], yy: [{ ...ITEM_IDX }] };
                const EXPECTED = [{ ...MAP.xx[0] }, { ...MAP.yy[0] }];
                const result = FN(MAP, 'id');
                expect(result).toEqual(EXPECTED);
            });
            it('should convert map as single item [idKey=2nd level], no 2nd item with id found', () => {
                const MAP = { xx: { ...ITEM_IDX }, yy: {} };
                const EXPECTED = [{ ...MAP.xx }];
                const result = FN(MAP, 'idx');
                expect(result).toEqual(EXPECTED);
            });
            it('should convert map as single item [idKey=2nd level], no 2nd item with id found', () => {
                const MAP = { xx: { ...ITEM_IDX }, yy: { ...ITEM_ID } };
                const EXPECTED = [{ ...MAP.xx }];
                const result = FN(MAP, 'idx');
                expect(result).toEqual(EXPECTED);
            });
            it('should convert map as single item [idKey=2nd level], no 2nd item with id found', () => {
                const MAP = { xx: { ...ITEM_IDX }, yy: { ...ITEM_ID } };
                const EXPECTED = [{ ...MAP.yy }];
                const result = FN(MAP, 'id');
                expect(result).toEqual(EXPECTED);
            });
        });
    });
});
describe('✅ convertArray2Map()', () => {
    const NAME_1 = { name: 'Item 1' };
    const NAME_2 = { name: 'Item 2' };
    const NAME_3 = { name: 'Item 3' };
    const _ITEM_1 = { id: 1, ...NAME_1 };
    const _ITEM_1a = { id: 1, ...NAME_2 };
    const _ITEM_2 = { id: 2, ...NAME_2 };
    const _ITEM_3 = { id: 3, ...NAME_3 };
    const FN = convertArray2Map<any>;
    let warnSpy: jest.SpyInstance;
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    describe('no idKey defined', () => {
        it('converts array to map', () => {
            const array = [_ITEM_1, _ITEM_2, _ITEM_3, _ITEM_1a];
            const result = FN(array, 'id');
            expect(result).toEqual({
                '1': _ITEM_1,
                '2': _ITEM_2,
                '3': _ITEM_3,
            });
            expect(warnSpy)
        });
        it('converts array to map', () => {
            const array = [{ name: '_Item 1' }, { name: 'Item 2_' }];
            const result = FN(array, 'id');
            expect(result).toEqual({
                __item_1__: { name: '_Item 1', [ID]: '__item_1__' },
                __item_2__: { name: 'Item 2_', [ID]: '__item_2__' },
            });
        });
        it('converts array to map', () => {
            const array = [{ name: 1 }, { name: false }, { name: 'x' }];
            // todo duplicated name with other values
            const result = FN(array);
            expect(result).toEqual({
                __1__: { name: 1, [ID]: '__1__' },
                __false__: { name: false, [ID]: '__false__' },
                __x__: { name: 'x', [ID]: '__x__' },
            });
        });
    });
    describe('with idKey defined', () => {
        it('converts array to map by name', () => {
            const array = [_ITEM_1, _ITEM_2, _ITEM_3, _ITEM_1a];
            const result = FN(array, 'name');
            expect(result).toEqual({
                'Item 1': _ITEM_1,
                'Item 2': _ITEM_2,
                'Item 3': _ITEM_3,
            });
        });
    });
    it('handles empty array', () => {
        const array: any[] = [];
        const result = FN(array);
        expect(result).toEqual({});
    });
});
describe('🚨 without mock API', () => {
    let warnSpy: jest.SpyInstance;
    beforeEach(() => {
        warnSpy = jest.spyOn(LOG, 'WARN');
    });
    afterEach(() => {
        warnSpy.mockRestore();
    });
    describe('convertData()', () => {
        const FN = convertData;
        const X_1 = { x: 4 };
        const X_2 = { x: 5 };
        const ID_1 = { id: 2 };
        const ID_2 = { id: 3 };
        const items = [ID_1];
        const itemsById = { ...ID_1 };
        const EMPTY_MAP = { total: 0, itemsById: {} };
        const NO_ITEMS = { total: 0, items: [] };
        const total = 1;
        describe('MAP => ARRAY', () => {
            const type = 'items';
            const EXPECTED = { items, total };
            const ID_ITEMS = { itemsById: { ID_1, ID_2 } };
            const X_ITEMS = { itemsById: { X_1, X_2 } };
            const ID_ITEMS_1 = { items: [{ ID_1, ID_2 }], total: 1 };
            const ID_ITEMS_2 = {
                items: [
                    { ...ID_1, [PROP]: 'ID_1' },
                    { ...ID_2, [PROP]: 'ID_2' },
                ],
                total: 2,
            };
            const X_ITEMS_2 = {
                items: [
                    { ...X_1, [PROP]: 'X_1', [KEY]: 'x', [ID]: X_1.x },
                    { ...X_2, [PROP]: 'X_2', [KEY]: 'x', [ID]: X_2.x },
                ],
                total: 2,
            };
            it('1. should not convert anything when items exists', () => {
                expect(FN({ items, total }, type)).toEqual(EXPECTED);
                expect(FN({ items, total: 0 }, type)).toEqual(EXPECTED);
                expect(FN({ items }, type)).toEqual(EXPECTED);
            });
            it('2. should convert map to one array item', () => {
                expect(FN({}, type)).toEqual(NO_ITEMS);
                expect(FN(ID_1, type)).toEqual(EXPECTED);
                expect(FN({ itemsById }, type)).toEqual(EXPECTED);
                expect(FN({ items }, type)).toEqual(EXPECTED);
                expect(FN({ items: ID_1 }, type)).toEqual(EXPECTED);
            });
            it('3. should convert unknown data structure', () => {
                const items = 'foo';
                const error = 'invalid data structure';
                const EXPECTED = { items: [{ items }], total: 1, error };
                expect(FN({ items }, type)).toEqual(EXPECTED);
            });
            it('4. should convert valid itemsById to one array item', () => {
                expect(FN(ID_ITEMS, type)).toEqual(ID_ITEMS_1);
            });
            it('5. should convert valid itemsById to multiple array items with key', () => {
                expect(FN(ID_ITEMS, type, 'x')).toEqual(NO_ITEMS);
                expect(FN(X_ITEMS, type, 'x')).toEqual(X_ITEMS_2);
                expect(FN(ID_ITEMS, type, 'id')).toEqual(ID_ITEMS_2);
                expect(FN(X_ITEMS, type, 'id')).toEqual(NO_ITEMS);
            });
        });
        describe('ARRAY => MAP', () => {
            const type = 'map';
            it('1. should not convert anything when items exists', () => {
                const EXPECTED = { itemsById, total: 1 };
                expect(FN({ itemsById, total }, type)).toEqual(EXPECTED);
                expect(FN({ itemsById, total: 0 }, type)).toEqual(EXPECTED); // it fixes total
                expect(FN({ itemsById }, type)).toEqual(EXPECTED); // it fixes total
            });
            it('2a. should convert array to map without id', () => {
                expect(FN(NO_ITEMS, type)).toEqual(EMPTY_MAP);
                const id = ID_1.id;
                const RESULT_1 = {
                    itemsById: { id, [PROPS]: [id] },
                    total: 1,
                };
                const RESULT_2 = {
                    itemsById: {
                        // 2: ID_1,
                        // 3: ID_2,
                        id: ID_2.id,
                        [PROPS]: [2, 3],
                    },
                    total: 1,
                };
                const itemsById = [ID_1];
                // console.log(RESULT_ONE);
                // console.log(FN({ items }, type))
                expect(FN({ items }, type)).toEqual(RESULT_1);
                expect(FN({ itemsById, total }, type)).toEqual(RESULT_1);
                expect(FN({ items: [ID_1] }, type)).toEqual(RESULT_1);
                expect(FN({ items: [ID_1, ID_2] }, type)).toEqual(RESULT_2);
                console.log(warnSpy.mock.calls);
                expect(warnSpy).toHaveBeenCalledWith(`${warnMSG}: ${id}`);
            });
            it('2a. should convert array to map with id', () => {
                expect(FN(NO_ITEMS, type)).toEqual(EMPTY_MAP);
                const id = ID_1.id;
                const RESULT_1 = {
                    itemsById: { [id]: ID_1, [PROPS]: [id] },
                    total: 1,
                };
                const RESULT_2 = {
                    itemsById: {
                        2: ID_1,
                        3: ID_2,
                        [PROPS]: [2, 3],
                    },
                    total: 2,
                };
                const itemsById = [ID_1];
                // console.log(RESULT_ONE);
                // console.log(FN({ items }, type))
                expect(FN({ items }, type, 'id')).toEqual(RESULT_1);
                expect(FN({ itemsById, total }, type, 'id')).toEqual(RESULT_1);
                expect(FN({ items: [ID_1] }, type, 'id')).toEqual(RESULT_1);
                expect(FN({ items: [ID_1, ID_2] }, type, 'id')).toEqual(RESULT_2);
            });
            it('3. should convert unknown invalid data structure', () => {
                const itemsById = 'foo';
                const error = 'invalid data structure';
                const EXPECTED = { itemsById, total: 1, error };
                expect(FN({ items: itemsById }, type)).toEqual(EXPECTED);
                expect(FN({ itemsById }, type)).toEqual(EXPECTED);
            });
            it('3a. should convert unknown invalid data structure', () => {
                const INPUT = { bla: [ID_1], foo: [ID_2] };
                const error = 'invalid data structure';
                const EXPECTED = { itemsById: INPUT, total: 1, error };
                expect(FN(INPUT, type)).toEqual(EXPECTED);
            });
            it('4. should convert unknown valid data structure', () => {
                const EXPECTED = {
                    itemsById: { 2: ID_1 },
                    total: 1,
                };
                expect(FN({ bla: [ID_1] }, type)).toEqual(EXPECTED);
            });
        });
    });
    describe('normalizeData()', () => {
        const FN = normalizeData;
        // TODO: simple array value, other keys, mixed keys
        describe('no config', () => {
            const items = [{ id: 2 }];
            const TARGET_ARR = { total: 1, items: [{ id: 2 }] };
            const TARGET_ARR_ID = { total: 1, items: [2] };
            const TARGET_MAP = { total: 1, itemsById: { id: 2 } };
            const TARGET_MAP_ID = { total: 1, itemsById: { 2: { id: 2 } } };
            const STR_ARRAY = JSON.stringify(TARGET_ARR);
            const STR_MAP = JSON.stringify(TARGET_MAP);
            const CONFIG: DATA_CONFIG = {
                baseEndpoint: '',
                itemsKey: '',
                totalKey: '',
                idKey: '',
            };
            // const DEFAULT_ARRAY: number[] = [];
            // const DEFAULT_MAP: { [key: string]: number } = {};
            it('should not convert anything when items exists', () => {
                expect(FN(STR_ARRAY, CONFIG, 'items')).toEqual(TARGET_ARR);
                expect(FN(STR_MAP, CONFIG, 'map')).toEqual(TARGET_MAP);
            });
            //

            it('convert with internal ids', () => {
                const input = {
                    foo: { name: 2 },
                    bar: { name: 3 },
                };
                const str = JSON.stringify(input);
                const EXPECTED = {
                    total: 2,
                    items: [
                        { name: 2, _id: 'foo' },
                        { name: 3, _id: 'bar' },
                    ],
                };
                expect(FN(str, CONFIG, 'items')).toEqual(EXPECTED);
            });
            it('convert as one obj', () => {
                const input = {
                    foo: 2,
                    bar: 3,
                };
                const str = JSON.stringify(input);
                const EXPECTED = {
                    total: 1,
                    items: [{ foo: 2, bar: 3 }],
                };
                expect(FN(str, CONFIG, 'items')).toEqual(EXPECTED);
            });
            it('should try to convert map <> array', () => {
                expect(FN(STR_ARRAY, CONFIG, 'map')).toEqual(TARGET_MAP_ID);
                expect(FN(STR_MAP, CONFIG, 'items', 'id')).toEqual(TARGET_ARR);
                // expect(FN(STR_MAP, CONFIG, 'items', 'id')).toEqual(TARGET_ARRAY_ID);
            });
            // TODO: items ohne total
        });
    });
});

describe('🧪 with mock API', () => {
    let spy: jest.SpyInstance;
    let infoSpy: jest.SpyInstance;
    let failSpy: jest.SpyInstance;
    let okSpy: jest.SpyInstance;
    let debugSpy: jest.SpyInstance;
    beforeEach(() => {
        infoSpy = jest.spyOn(LOG, 'INFO');
        failSpy = jest.spyOn(LOG, 'FAIL');
        debugSpy = jest.spyOn(LOG, 'DEBUG');
        okSpy = jest.spyOn(LOG, 'OK');
        spy = spyOnCMD(); // <= ⚠️ important; don't remove
    });
    afterEach(() => {
        spy.mockRestore();
        jest.clearAllMocks();
        infoSpy.mockRestore();
        failSpy.mockRestore();
        debugSpy.mockRestore();
        mock.restore();
        // readline.cursorTo(process.stdout, 0);
    });
    describe('readDataFromFile', () => {
        const FN = readDataFromFile;
        const FILE_PATH = 'raw/test_data.json';
        const FALLBACK: Json = {};
        afterEach(() => {
            mock.restore();
        });
        it('should load data from file correctly', () => {
            mock({
                [FILE_PATH]: '{ "key": "value" }',
            });
            const data = FN(FILE_PATH, FALLBACK);
            expect(data).toEqual({ key: 'value' });
            expect(okSpy).toHaveBeenCalledWith(`💾 data from file exists`);
        });
        it('should return empty object when file does not exist', () => {
            mock({});
            const data = FN(FILE_PATH, FALLBACK);
            expect(data).toEqual({});
            expect(failSpy).toHaveBeenCalledWith(
                `💾 file does not exist: ${FILE_PATH}`
            );
        });
    });
    describe('getItemListFromFile()', () => {
        const FN = getItemListFromFile;
        const FILE_PATH = 'raw/test_data.json';

        afterEach(() => {
            mock.restore();
        });
        it('should load data from file correctly', () => {
            mock({
                [FILE_PATH]: '{ "total": 5, "items": [1,2,3,4,5] }',
            });
            const data = FN(FILE_PATH);
            expect(data).toEqual({ total: 5, items: [1, 2, 3, 4, 5] });
            expect(okSpy).toHaveBeenCalledWith(`💾 data from file loaded`);
        });
        it('should return empty data when file does not exist', () => {
            mock({});
            const data = FN(FILE_PATH);
            expect(data).toEqual(FALLBACK_LIST);
            expect(failSpy).toHaveBeenCalledWith(
                `💾 file does not exist: ${FILE_PATH}`
            );
        });
        it('should return empty data when not items format', () => {
            mock({
                [FILE_PATH]: '{ "xxx": 99 }',
            });
            const data = FN(FILE_PATH);
            expect(data).toEqual(FALLBACK_LIST);
            expect(failSpy).toHaveBeenCalledWith(
                `💾 Invalid data format in file: ${FILE_PATH}`
            );
        });
        it('should return empty data when file has invalid format', () => {
            mock({
                [FILE_PATH]: 'foobar',
            });
            const data = FN(FILE_PATH);
            expect(data).toEqual(FALLBACK_LIST);
            expect(failSpy).toHaveBeenCalledWith(
                `💾 Invalid data format in file: ${FILE_PATH}`
            );
        });
    });
    describe('getItemMapFromFile()', () => {
        const FN = getItemMapFromFile;
        type TYPE = SAMPLE_DATA;
        const SAMPLE: DATA_MAP<TYPE> = FAKE_MAP_RESULT_3;
        const FILE_PATH = 'raw/test_data.json';
        afterEach(() => {
            mock.restore();
        });
        it('should load data from file correctly', () => {
            mock({
                [FILE_PATH]: JSON.stringify(SAMPLE),
            });
            const data = FN(FILE_PATH);
            expect(data).toEqual(SAMPLE);
            expect(okSpy).toHaveBeenCalledWith(`💾 data from file loaded`);
        });
        it('should return empty data when file does not exist', () => {
            mock({});
            const data = FN(FILE_PATH);
            expect(data).toEqual(FALLBACK_MAP);
            expect(failSpy).toHaveBeenCalledWith(
                `💾 file does not exist: ${FILE_PATH}`
            );
        });
        it('should return empty data when not itemsById format', () => {
            mock({
                [FILE_PATH]: '{ "total": 5, "items": [1,2,3,4,5] }',
            });
            const data = FN(FILE_PATH);
            expect(data).toEqual(FALLBACK_MAP);
            expect(failSpy).toHaveBeenCalledWith(
                `💾 Invalid data format in file: ${FILE_PATH}`
            );
        });
        it('should return empty data when file has invalid format', () => {
            mock({
                [FILE_PATH]: 'foobar',
            });
            const data = FN(FILE_PATH);
            expect(data).toEqual(FALLBACK_MAP);
            expect(failSpy).toHaveBeenCalledWith(
                `💾 Invalid data format in file: ${FILE_PATH}`
            );
        });
    });
    describe('✅📋🧩 getFallBackByType()', () => {
        const FN = getFallBackByType;
        type TYPE = SAMPLE_DATA;
        it('📋 should return fallback list items', () => {
            const result = FN<TYPE>('items');
            expect(result).toEqual(FALLBACK_LIST);
        });
        it('🧩 should return fallback map', () => {
            const result = FN<TYPE>('map');
            expect(result).toEqual(FALLBACK_MAP);
        });
    });
    describe('✅📋🧩 getIssues()', () => {
        const FN = getIssues;
        const key = 'sample_data';
        const LOG_API = `Fetching fresh ${key} data from API...`;
        const LOG_DEMO = `💾 Loading demo ${key} data from file...`;
        const LOG_CACHE = `💾 Loading cache ${key} data from file...`;
        const LOG_UNKNOWN = `Unknown data mode: xxx`;
        const FAIL_FILE = `💾 file does not exist: `;
        const FILE_PATH_DEMO = `src/_data/raw/${key}_demo.json`;
        const FILE_PATH_CACHE = `src/_data/raw/${key}_cache.json`;
        afterEach(() => {
            mock.restore();
            // readline.cursorTo(process.stdout, 0);
        });
        describe('📋 TYPE: items', () => {
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_LIST;
            const DATA: MOCK_DATA = {
                live: FAKE_LIST_RESULT_3,
                demo: FAKE_LIST_RESULT_1,
                cache: FAKE_LIST_RESULT_2,
                fallback: FAKE_LIST_RESULT_FALLBACK,
            };
            beforeEach(() => {
                mock(createMockFiles(DATA, key));
            });
            describe('mode: live', () => {
                const mode = 'live';
                it('should get data from API', () => {
                    const result = FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.live);
                    expect(infoSpy).toHaveBeenCalledWith(LOG_API);
                    expect(debugSpy.mock.calls.length).toEqual(1);
                    expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 3`);
                });
            });
            describe('mode: demo', () => {
                const mode = 'demo';
                const PATH = FILE_PATH_DEMO;
                it('should get demo data from file system', () => {
                    const result = FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.demo);
                    expect(infoSpy).toHaveBeenCalledWith(LOG_DEMO);
                    expect(debugSpy.mock.calls.length).toEqual(0);
                    expect(failSpy.mock.calls.length).toEqual(0);
                });
                it('should return empty data for no demo file', () => {
                    mock.restore();
                    const result = FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.fallback);
                    expect(failSpy).toHaveBeenCalledWith(`${FAIL_FILE}${PATH}`);
                });
            });
            describe('mode: cache', () => {
                const mode = 'cache';
                const PATH = FILE_PATH_CACHE;
                it('should get cache data from file system', () => {
                    const result = FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.cache);
                    expect(infoSpy).toHaveBeenCalledWith(LOG_CACHE);
                    expect(failSpy.mock.calls.length).toEqual(0);
                    expect(debugSpy.mock.calls.length).toEqual(0);
                });
                it('should return empty data for no cache file', () => {
                    mock.restore();
                    const result = FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.fallback);
                    expect(failSpy).toHaveBeenCalledWith(`${FAIL_FILE}${PATH}`);
                });
            });
            describe('mode: xxx', () => {
                const mode = 'xxx';
                it('should return empty data for unknown mode', () => {
                    const result = FN(mode as any, ENDPOINT);
                    expect(result).toEqual(DATA.fallback);
                    expect(failSpy).toHaveBeenCalledWith(LOG_UNKNOWN);
                });
            });
        });
        describe('🧩 TYPE: map', () => {
            const type = 'map';
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_MAP;
            const DATA: MOCK_DATA = {
                live: FAKE_MAP_RESULT_3,
                demo: FAKE_MAP_RESULT_1,
                cache: FAKE_MAP_RESULT_2,
                fallback: FAKE_MAP_RESULT_FALLBACK,
            };
            beforeEach(() => {
                mock(createMockFiles(DATA, key));
            });
            describe('mode: live', () => {
                const mode = 'live';
                it('should get data from API', () => {
                    const result = FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.live);
                    expect(infoSpy).toHaveBeenCalledWith(LOG_API);
                    expect(debugSpy.mock.calls.length).toEqual(1);
                    expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 3`);
                });
            });
            describe('mode: demo', () => {
                const mode = 'demo';
                const PATH = FILE_PATH_DEMO;
                it('should get demo data from file system', () => {
                    const result = FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.demo);
                    expect(infoSpy).toHaveBeenCalledWith(LOG_DEMO);
                    expect(debugSpy.mock.calls.length).toEqual(0);
                    expect(failSpy.mock.calls.length).toEqual(0);
                });
                it('should return empty data for no demo file', () => {
                    mock.restore();
                    const result = FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.fallback);
                    expect(failSpy).toHaveBeenCalledWith(`${FAIL_FILE}${PATH}`);
                });
            });
            describe('mode: cache', () => {
                const mode = 'cache';
                const PATH = FILE_PATH_CACHE;
                it('should get cache data from file system', () => {
                    const result = FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.cache);
                    expect(infoSpy).toHaveBeenCalledWith(LOG_CACHE);
                    expect(failSpy.mock.calls.length).toEqual(0);
                    expect(debugSpy.mock.calls.length).toEqual(0);
                });
                it('should return empty data for no cache file', () => {
                    mock.restore();
                    const result = FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.fallback);
                    expect(failSpy).toHaveBeenCalledWith(`${FAIL_FILE}${PATH}`);
                });
            });
            describe('mode: xxx', () => {
                const mode = 'xxx';
                it('should return empty data for unknown mode', () => {
                    const result = FN(mode as any, ENDPOINT, type);
                    expect(result).toEqual(DATA.fallback);
                    expect(failSpy).toHaveBeenCalledWith(LOG_UNKNOWN);
                });
            });
        });
    });
    describe('✅📋🧩 getItemsByAPI()', () => {
        const FN = getItemsByAPI;
        describe('📋 TYPE: items (with civic issues)', () => {
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_CIVIC_ISSUES;
            type TYPE = CIVIC_ISSUE_ITEM;
            const key = ENDPOINT.endpoint.key;
            it('get all items from API in less calls', () => {
                const EXPECTED: DATA_ITEMS<TYPE> = {
                    total: 4,
                    items: getMockItems(['2', '3', '4', '1']),
                };
                const result: DATA_TYPES<TYPE> = FN(ENDPOINT);
                expect(result.total).toEqual(4);
                expect(debugSpy.mock.calls.length).toEqual(4);
                expect(failSpy.mock.calls.length).toEqual(0); // check no fail
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 1`);
                expect(result).toEqual(EXPECTED);
            });
        });
        describe('📋 TYPE: items', () => {
            type TYPE = SAMPLE_DATA;
            const type = 'items';
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_LIST;
            const key = ENDPOINT.endpoint.key;
            const LIVE_DATA: SAMPLE_LIST = FAKE_LIST_RESULT_3;

            it('get all items from API', () => {
                const result: DATA_TYPES<TYPE> = FN(ENDPOINT, type, 1);
                expect(result.total).toEqual(3);
                expect(debugSpy.mock.calls.length).toEqual(3);
                expect(failSpy.mock.calls.length).toEqual(0); // check no fail
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 3`);
                expect(result).toEqual(LIVE_DATA);
            });
            it('get all items from API in less calls', () => {
                const result: DATA_TYPES<TYPE> = FN(ENDPOINT);
                expect(result.total).toEqual(3);
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(failSpy.mock.calls.length).toEqual(0); // check no fail
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 3`);
                expect(result).toEqual(LIVE_DATA);
            });
        });
        describe('🧩 TYPE: map', () => {
            type TYPE = SAMPLE_DATA;
            const type = 'map';
            const ENDPOINT = ENDPOINT_CONFIG_SAMPLE_MAP;
            // const ENDPOINT = ENDPOINT_CONFIG_SAMPLE_LIST;
            const key = ENDPOINT.endpoint.key;
            const LIVE_DATA: SAMPLE_MAP = FAKE_MAP_RESULT_3;
            it('get single state items from simple API without states def', () => {
                const result: DATA_TYPES<TYPE> = FN(ENDPOINT, type);
                expect(failSpy.mock.calls.length).toEqual(0); // check no fail
                expect(result.total).toEqual(3);
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 3`);
                expect(result).toEqual(LIVE_DATA);
            });
            it('get single state items from simple API with empty states', () => {
                const ENDPOINT_V2: ENDPOINT_CONFIG = {
                    ...ENDPOINT,
                    endpoint: {
                        ...ENDPOINT.endpoint,
                        states: [],
                    },
                };
                const result: DATA_TYPES<TYPE> = FN(ENDPOINT_V2, type);
                expect(failSpy.mock.calls.length).toEqual(0); // check no fail
                expect(result.total).toEqual(3);
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(debugSpy).toHaveBeenCalledWith(`🧪 MOCK: ${key}: 3`);
                expect(result).toEqual(LIVE_DATA);
            });
        });
    });
    describe('✅📋🧩 proceedItems()', () => {
        const FN = proceedItems;
        const EP_GEO: ENDPOINT_CONFIG = ENDPOINT_CONFIG_NOMINATIM;
        const FILE_FAIL = `💾 file does not exist: `;
        const FILE_OK = `💾 data from file loaded`;
        const API_OK = `API is accessible (status: 200).`;
        const API_FAIL = `API not accessible (status: 503), switching to demo mode.`;
        describe('📋 TYPE: items', () => {
            // TODO: refactor
            const type: DATA_TYPE = 'items';
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_LIST;
            const DEMO_DATA: SAMPLE_LIST = FAKE_LIST_RESULT_1;
            const CACHE_DATA: SAMPLE_LIST = FAKE_LIST_RESULT_2;
            const LIVE_DATA: SAMPLE_LIST = FAKE_LIST_RESULT_3;
            const FALLBACK = FAKE_LIST_RESULT_FALLBACK;
            const key = ENDPOINT.endpoint.key;
            const FILE_PATH_DEMO = `src/_data/raw/${key}_demo.json`;
            const FILE_PATH_CACHE = `src/_data/raw/${key}_cache.json`;
            beforeEach(() => {
                mock({
                    [FILE_PATH_DEMO]: JSON.stringify(DEMO_DATA),
                    [FILE_PATH_CACHE]: JSON.stringify(CACHE_DATA),
                });
            });
            describe('mode: demo', () => {
                const mode: DATA_MODE = 'demo';
                const PATH = FILE_PATH_DEMO;
                it('should fail load demo data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(FALLBACK);
                    expect(failSpy).toHaveBeenCalledWith(`${FILE_FAIL}${PATH}`);
                });
                it('should load demo data when file exists', () => {
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DEMO_DATA);
                    expect(okSpy).toHaveBeenCalledWith(FILE_OK);
                });
            });
            describe('mode: cache', () => {
                const mode: DATA_MODE = 'cache';
                const PATH = FILE_PATH_CACHE;
                it('should fail load cache data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(FALLBACK);
                    expect(failSpy).toHaveBeenCalledWith(`${FILE_FAIL}${PATH}`);
                });
                it('should load cache data when file exists', () => {
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(CACHE_DATA);
                    expect(okSpy).toHaveBeenCalledWith(FILE_OK);
                });
            });
            describe('mode: live', () => {
                it('should load live data when API reachable', () => {
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT, type);
                    expect(result).toEqual(LIVE_DATA);
                    expect(okSpy).toHaveBeenCalledWith(API_OK);
                });
                it('should load demo data when API not reachable', () => {
                    const getHttpBaseSpy = mockServiceUnavailable();
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT, type);
                    expect(result).toEqual(DEMO_DATA);
                    expect(failSpy).toHaveBeenCalledWith(API_FAIL);
                    getHttpBaseSpy.mockRestore();
                });
            });
        });
        describe('🧩 TYPE: map', () => {
            const type: DATA_TYPE = 'map';
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_MAP;
            const DEMO_DATA: SAMPLE_MAP = FAKE_MAP_RESULT_1;
            const CACHE_DATA: SAMPLE_MAP = FAKE_MAP_RESULT_2;
            const LIVE_DATA: SAMPLE_MAP = FAKE_MAP_RESULT_3;
            const FALLBACK = FAKE_MAP_RESULT_FALLBACK;
            const key = ENDPOINT.endpoint.key;
            const FILE_PATH_DEMO = `src/_data/raw/${key}_demo.json`;
            const FILE_PATH_CACHE = `src/_data/raw/${key}_cache.json`;
            beforeEach(() => {
                mock({
                    [FILE_PATH_DEMO]: JSON.stringify(DEMO_DATA),
                    [FILE_PATH_CACHE]: JSON.stringify(CACHE_DATA),
                });
            });
            describe('mode: demo', () => {
                const mode: DATA_MODE = 'demo';
                it('should fail load demo data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_MAP>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(FALLBACK);
                });
                it('should load demo data when file exists', () => {
                    const result = <SAMPLE_MAP>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DEMO_DATA);
                });
            });
            describe('mode: cache', () => {
                const mode: DATA_MODE = 'cache';
                it('should fail load cache data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(FALLBACK);
                });
                it('should load cache data when file exists', () => {
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(CACHE_DATA);
                });
            });
            describe('mode: live', () => {
                it('should load live data when API reachable', () => {
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT, type);
                    expect(result).toEqual(LIVE_DATA);
                });
                it('should load demo data when API not reachable', () => {
                    const getHttpBaseSpy = mockServiceUnavailable();
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT, type);
                    expect(result).toEqual(DEMO_DATA);
                    getHttpBaseSpy.mockRestore();
                });
            });
        });
        describe('TYPE-Conversion: 🧩 map <> 📋 list', () => {
            describe('map', () => {
                // TODO: fix
                const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_LIST;
                xit('should load map from array 📋 => 🧩', () => {
                    const result = <SAMPLE_MAP>FN('live', ENDPOINT, 'map');
                    const EXPECTED: SAMPLE_MAP = FAKE_MAP_RESULT_3;
                    expect(result).toEqual(EXPECTED);
                });
            });
            describe('array', () => {
                const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_MAP;
                it('should load map from array 📋 => 🧩', () => {
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT, 'items');
                    const EXPECTED: SAMPLE_LIST = FAKE_LIST_RESULT_3;
                    expect(result).toEqual(EXPECTED);
                });
            });
            xit('should load array from map 🧩 => 📋', () => {
                const result = <DATA_ITEMS<PLACE>>FN('live', EP_GEO, 'items');
                const EXPECTED: DATA_ITEMS<PLACE> = {
                    total: 1,
                    items: [MOCK_ADDRESS_ITEMS['52.3856617-13.1264399406723']],
                };
                expect(result).toEqual(EXPECTED);
            });
        });
    });
    // TODO: getIssues map data is nicht abstrakt
    describe('✅📋🧩 loadItems()', () => {
        const FN = loadItems;
        const key = 'sample_data';
        describe('📋 TYPE: items', () => {
            const ENDPOINT: ENDPOINT_CONFIG = ENDPOINT_CONFIG_SAMPLE_LIST;
            const DATA: MOCK_DATA = {
                live: FAKE_LIST_RESULT_3,
                demo: FAKE_LIST_RESULT_1,
                cache: FAKE_LIST_RESULT_2,
                fallback: FAKE_LIST_RESULT_FALLBACK,
            };
            beforeEach(() => {
                mock(createMockFiles(DATA, key));
            });
            describe('mode: demo', () => {
                const mode: DATA_MODE = 'demo';
                it('should fail load demo data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.fallback);
                });
                it('should load demo data when file exists', () => {
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.demo);
                });
            });
            describe('mode: cache', () => {
                const mode: DATA_MODE = 'cache';
                it('should fail load cache data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.fallback);
                });
                it('should load cache data when file exists', () => {
                    const result = <SAMPLE_LIST>FN(mode, ENDPOINT);
                    expect(result).toEqual(DATA.cache);
                });
            });
            describe('mode: live', () => {
                it('should load live data when API reachable', () => {
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT);
                    expect(result).toEqual(DATA.live);
                });
                it('should load demo data when API not reachable', () => {
                    const getHttpBaseSpy = mockServiceUnavailable();
                    const result = <SAMPLE_LIST>FN('live', ENDPOINT);
                    expect(result).toEqual(DATA.demo);
                    getHttpBaseSpy.mockRestore();
                });
            });
        });
        describe('🧩 TYPE: map', () => {
            const type = 'map';
            const ENDPOINT = ENDPOINT_CONFIG_SAMPLE_MAP;
            const DATA: MOCK_DATA = {
                live: FAKE_MAP_RESULT_3,
                demo: FAKE_MAP_RESULT_1,
                cache: FAKE_MAP_RESULT_2,
                fallback: FAKE_MAP_RESULT_FALLBACK,
            };
            beforeEach(() => {
                mock(createMockFiles(DATA, key));
            });
            describe('mode: demo', () => {
                const mode: DATA_MODE = 'demo';
                it('should fail load demo data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_MAP>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.fallback);
                });
                it('should load demo data when file exists', () => {
                    const result = <SAMPLE_MAP>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.demo);
                });
            });
            describe('mode: cache', () => {
                const mode: DATA_MODE = 'cache';
                it('should fail load cache data when no file', () => {
                    mock.restore();
                    const result = <SAMPLE_MAP>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.fallback);
                });
                it('should load cache data when file exists', () => {
                    const result = <SAMPLE_MAP>FN(mode, ENDPOINT, type);
                    expect(result).toEqual(DATA.cache);
                });
            });
            describe('mode: live', () => {
                it('should load live data when API reachable', () => {
                    const result = <SAMPLE_MAP>FN('live', ENDPOINT, type);
                    expect(result).toEqual(DATA.live);
                });
                it('should load demo data when API not reachable', () => {
                    const getHttpBaseSpy = mockServiceUnavailable();
                    const result = <SAMPLE_MAP>FN('live', ENDPOINT, type);
                    expect(result).toEqual(DATA.demo);
                    getHttpBaseSpy.mockRestore();
                });
            });
        });
    });
});
