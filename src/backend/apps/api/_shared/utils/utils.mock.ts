import { DATA_ITEMS, DATA_MAP, SAMPLE_DATA } from '../../endpoints/endpoints.d';

// 📋 TYPE: items
export const FAKE_LIST_RESULT_FALLBACK: DATA_ITEMS<SAMPLE_DATA> = {
    total: 0,
    items: [],
    error: 'fallback',
};
export const FAKE_LIST_RESULT_1: DATA_ITEMS<SAMPLE_DATA> = {
    total: 1,
    items: [{ id: 1 }],
};
export const FAKE_LIST_RESULT_2: DATA_ITEMS<SAMPLE_DATA> = {
    total: 2,
    items: [{ id: 1 }, { id: 2 }],
};
export const FAKE_LIST_RESULT_3: DATA_ITEMS<SAMPLE_DATA> = {
    total: 3,
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
};

// 🧩 TYPE: map
export const FAKE_MAP_RESULT_FALLBACK: DATA_MAP<SAMPLE_DATA> = {
    total: 0,
    itemsById: {},
    error: 'fallback',
};
export const FAKE_MAP_RESULT_1: DATA_MAP<SAMPLE_DATA> = {
    total: 1,
    itemsById: {
        '1': { id: 1 },
    },
};
export const FAKE_MAP_RESULT_2: DATA_MAP<SAMPLE_DATA> = {
    total: 2,
    itemsById: {
        '1': { id: 1 },
        '2': { id: 2 },
    },
};
export const FAKE_MAP_RESULT_3: DATA_MAP<SAMPLE_DATA> = {
    total: 3,
    itemsById: {
        '1': { id: 1 },
        '2': { id: 2 },
        '3': { id: 3 },
    },
};
