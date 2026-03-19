import { $PLACE, COORD } from '../endpoints/geo/geo.d';
export type ISSUE_CATEGORY = {
    id: number;
    createdAt: string;
    categoryName: string;
};
export type PICTURE_ITEM = {
    id: number;
    createdAt: number;
    filename: string;
    fileCDNUrl: string;
    published: boolean;
};
export type CIVIC_ISSUE_STATE =
    | 'OPEN'
    | 'CLOSED'
    | 'NOT_RESPONSIBLE'
    | 'IN_PROCESS';

export type CIVIC_ISSUE_ITEM = {
    createdAt: string;
    id: number;
    category: ISSUE_CATEGORY;
    coordinate: COORD;
    flawReporter: {
        id: number;
        createdAt: string;
    };
    originalText: string;
    pictures: PICTURE_ITEM[];
    replacingText: string;
    state: CIVIC_ISSUE_STATE;
};

export type CIVIC_ISSUE_ITEMS = {
    [key: string]: CIVIC_ISSUE_ITEM;
};

export type CIVIC_ISSUE_EXTENDED_ITEM = CIVIC_ISSUE_ITEM & {
    streetID: string | null;
    streetName: string | null;
    place: $PLACE;
};
export type CIVIC_ISSUES_DATA = {
    items: CIVIC_ISSUE_ITEM[];
};
export type CIVIC_ISSUES_DATA_EXTENDED = {
    items: CIVIC_ISSUE_EXTENDED_ITEM[];
};
export type UPDATE_DATA = {
    issues: CIVIC_ISSUES_DATA_EXTENDED;
    coords: FOUND_COORDS;
};
export type RAW_CIVIC_ISSUE_DATA = {
    isEmployee: boolean;
    reports: CIVIC_ISSUE_ITEM[];
    totalCnt: number;
};
export type API_CONFIG = {
    PROVIDER: string;
    STATE: string;
    LIMIT: string;
    OFFSET: string;
};
export type PLACE_ELEMENT = {
    place: $PLACE;
    state: UPDATE_COORD_RESULT;
};

export type STREET = {
    streetID: string | null;
    streetName: string | null;
};

export type MOCK_CONTENT = {
    originalText: string;
    replacingText: string;
    pictures: PICTURE_ITEM[];
};
export type CONFIG_WAITING = {
    // useMockData?: boolean;
    waitTimeMS?: number;
    numIssuesWait?: number;
};

// export type DATA_CONFIG = {
//     apiProvider?: string;
// }
