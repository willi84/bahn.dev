import { DATA_ITEMS } from '../endpoints/endpoints.d';
import {
    COORD_BY_ID,
    COORDS,
    FOUND_COORDS,
    GEO_ID,
} from '../endpoints/geo/geo.d';
import {
    CIVIC_ISSUE_EXTENDED_ITEM,
    CIVIC_ISSUE_ITEM,
    CIVIC_ISSUES_DATA_EXTENDED,
    MOCK_CONTENT,
    UPDATE_DATA,
} from './civic_issues.d';

export const MOCK_COORDS: COORDS = {
    '52.3856617-13.1264399406723': {
        id: '52.3856617-13.1264399406723',
        place: {
            place_id: '13200185',
            licence: 'some license',
            osm_type: 'way',
            osm_id: '191232627',
            lat: '52.3856617',
            lon: '13.1264399406723',
            display_name:
                '30, Wagnerstraße, Stern, Potsdam, 14480, Deutschland',
            address: {
                house_number: '30',
                road: 'Wagnerstraße',
                suburb: 'Stern',
                city: 'Potsdam',
                state: 'Brandenburg',
                postcode: '14480',
                country: 'Germany',
                country_code: 'de',
            },
            boundingbox: [
                '52.3856117',
                '52.3857117',
                '13.1263899406723',
                '13.1264899406723',
            ],
        },
        // count: 0,
    },
    '52.4556561-13.1005985': {
        id: '52.4556561-13.1005985',
        place: {
            place_id: '19876543',
            licence: 'some license',
            osm_type: 'way',
            osm_id: '209876543',
            lat: '52.4556561',
            lon: '13.1005985',
            display_name: 'Fakeplatz, Potsdam Deutschland',
            address: {
                house_number: '1',
                road: 'Fakeplatz',
                suburb: 'Stern',
                city: 'Potsdam',
                state: 'Brandenburg',
                country: 'Germany',
                country_code: 'de',
            },
            boundingbox: [
                '52.4556061',
                '52.4557061',
                '13.1005485',
                '13.1006485',
            ],
        },
        // count: 0,
    },
    '52.3995339-13.0624531': {
        id: '52.3995339-13.0624531',
        place: {
            place_id: '17654321',
            licence: 'some license',
            osm_type: 'way',
            osm_id: '217654321',
            lat: '52.3995339',
            lon: '13.0624531',
            display_name:
                'Am Mühlengraben, Potsdam, Brandenburg, 14469, Deutschland',
            address: {
                road: 'Am Mühlengraben',
                suburb: 'Stern',
                city: 'Potsdam',
                state: 'Brandenburg',
                postcode: '14469',
                country: 'Germany',
                country_code: 'de',
            },
            boundingbox: [
                '52.3994839',
                '52.3995839',
                '13.0624031',
                '13.0625031',
            ],
        },
        // count: 0,
    },
    '52.3997193-13.0628258': {
        id: '52.3997193-13.0628258',
        place: {
            place_id: '16543210',
            licence: 'some license',
            osm_type: 'way',
            osm_id: '216543210',
            lat: '52.3997193',
            lon: '13.0628258',
            display_name:
                'An der Pirschheide, Potsdam, Brandenburg, 14469, Deutschland',
            address: {
                road: 'An der Pirschheide',
                suburb: 'Stern',
                city: 'Potsdam',
                state: 'Brandenburg',
                postcode: '14469',
                country: 'Germany',
                country_code: 'de',
            },
            boundingbox: [
                '52.3996693',
                '52.3997693',
                '13.0627758',
                '13.0628758',
            ],
        },
        // count: 0,
    },
};
const coordKeys = Object.keys(MOCK_COORDS);

const USED_COORDS: COORD_BY_ID = {};
for (const key of coordKeys) {
    const item = MOCK_COORDS[key].place;
    const geoID = `${item?.lat}-${item?.lon}`;
    if (item) {
        USED_COORDS[geoID] = {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
        };
    }
}
const CATEGORIES = {
    'FAKE: Öffentliches Grün / Spielplatz': {
        createdAt: '2026-11-12T12:57:48.784+00:00',
        id: 5,
        categoryName: 'FAKE: Öffentliches Grün / Spielplatz',
    },
    'FAKE: Straßenschäden': {
        createdAt: '2026-11-12T12:57:48.784+00:00',
        id: 3,
        categoryName: 'FAKE: Straßenschäden',
    },
    'FAKE: Müll / Abfall': {
        createdAt: '2026-11-12T12:57:48.784+00:00',
        id: 7,
        categoryName: 'FAKE: Müll / Abfall',
    },
};
const FLAW_REPORTERS = {
    3: {
        createdAt: '2026-11-12T10:04:31.458+00:00',
        id: 3,
    },
    4: {
        createdAt: '2026-11-13T09:20:15.789+00:00',
        id: 4,
    },
    5: {
        createdAt: '2026-11-14T11:45:22.123+00:00',
        id: 5,
    },
};
const FAKE_TEXT: { [key: string]: MOCK_CONTENT } = {
    standard: {
        originalText: 'Hallo,\r\n\r\ntext',
        replacingText: 'Hallo,\r\n\r\ntext (...) ',
        pictures: [],
    },
};

export const MOCK_ISSUES: CIVIC_ISSUE_ITEM[] = [
    {
        createdAt: '2026-11-27T07:56:02.071+00:00',
        id: 1,
        category: CATEGORIES['FAKE: Öffentliches Grün / Spielplatz'],
        coordinate: USED_COORDS['52.3856617-13.1264399406723'],
        flawReporter: FLAW_REPORTERS[3],
        ...FAKE_TEXT['standard'],
        state: 'IN_PROCESS',
    },
    {
        createdAt: '2026-11-20T10:15:45.123+00:00',
        id: 2,
        category: CATEGORIES['FAKE: Straßenschäden'],
        coordinate: USED_COORDS['52.4556561-13.1005985'],
        flawReporter: FLAW_REPORTERS[4],
        ...FAKE_TEXT['standard'],
        state: 'OPEN',
    },
    {
        createdAt: '2026-11-20T10:15:45.123+00:00',
        id: 3,
        category: CATEGORIES['FAKE: Müll / Abfall'],
        coordinate: USED_COORDS['52.3995339-13.0624531'],
        flawReporter: FLAW_REPORTERS[4],
        ...FAKE_TEXT['standard'],
        state: 'OPEN',
    },
    {
        createdAt: '2026-11-15T14:30:10.456+00:00',
        id: 4,
        category: CATEGORIES['FAKE: Müll / Abfall'],
        coordinate: USED_COORDS['52.3995339-13.0624531'],
        flawReporter: FLAW_REPORTERS[5],
        ...FAKE_TEXT['standard'],
        state: 'CLOSED',
    },
];

const MOCK_ISSUE_BY_GEO_ID: Record<GEO_ID, CIVIC_ISSUE_ITEM> = {};
for (const issue of MOCK_ISSUES) {
    const geoID: GEO_ID = `${issue.coordinate.latitude}-${issue.coordinate.longitude}`;
    MOCK_ISSUE_BY_GEO_ID[geoID] = issue;
}

const MOCK_ISSUE_BY_ID: Record<string, CIVIC_ISSUE_ITEM> = {};

for (const issue of MOCK_ISSUES) {
    MOCK_ISSUE_BY_ID[String(issue.id)] = issue;
}
// TODO: also with geoID
export const getMockItems = (IDS: string[] | GEO_ID[]): CIVIC_ISSUE_ITEM[] => {
    const result: CIVIC_ISSUE_ITEM[] = [];
    for (const id of IDS) {
        if (id.indexOf('-') !== -1) {
            // geoID
            const issue = MOCK_ISSUE_BY_GEO_ID[id as GEO_ID];
            if (issue) {
                result.push(issue);
            }
        } else if (MOCK_ISSUE_BY_ID[id]) {
            result.push(MOCK_ISSUE_BY_ID[id]);
        }
    }
    return result;
};
export const getMockItem = (id: string | GEO_ID): CIVIC_ISSUE_ITEM => {
    const items = getMockItems([id]);
    return items.length > 0 ? items[0] : ({} as CIVIC_ISSUE_ITEM);
};

export const MOCK_EXTENDED_ISSUES: {
    [key: string]: CIVIC_ISSUE_EXTENDED_ITEM;
} = {};
for (const issue of MOCK_ISSUES) {
    const geoID = `${issue.coordinate.latitude}-${issue.coordinate.longitude}`;
    const place = MOCK_COORDS[geoID]?.place || null;
    if (place && place.address && place.address.road) {
        const streetName: string = place?.address?.road;
        // using the real function cauases an issue with dependencies
        const streetID: string = streetName
            ?.toLowerCase()
            .replace(/stra[ss|\ß]e/g, 'str')
            .replace(/ü/, 'ue')
            .replace(/ö/, 'oe')
            .replace(/ä/, 'ae')
            .replace(/\s+/g, '_');
        MOCK_EXTENDED_ISSUES[issue.id] = {
            ...issue,
            streetID,
            id: issue.id,
            streetName,
            place,
        };
    }

    // return {
    //     ...issue,
}
// );

/**
 * 🎯 get expected data structure from reports
 * @param {CIVIC_ISSUE_ITEM[]} reports ➡️ The civic issue reports.
 * @returns {UPDATE_DATA} 📤 The expected data structure.
 */
export const _getExpectedFromReports = <T extends CIVIC_ISSUE_ITEM>( // TODO
    reports: DATA_ITEMS<T>
    // reports: CIVIC_ISSUE_ITEM[]
): UPDATE_DATA => {
    const reportsItems = reports.items;
    const issues: CIVIC_ISSUES_DATA_EXTENDED = { items: [] };
    const NEW_COORDS: FOUND_COORDS = {};
    for (const issue of reportsItems) {
        const coordinate = issue.coordinate;
        const geoID: GEO_ID = `${coordinate.latitude}-${coordinate.longitude}`;
        if (!NEW_COORDS[geoID]) {
            NEW_COORDS[geoID] = {
                ...MOCK_COORDS[geoID],
                count: 1,
            };
        } else {
            NEW_COORDS[geoID].count += 1;
        }
        const extendedIssue = MOCK_EXTENDED_ISSUES[issue.id];
        if (extendedIssue) {
            issues.items.push(extendedIssue);
        }
    }
    return {
        issues,
        coords: NEW_COORDS,
    };
};

export const MOCK_CIVIC_OPEN_ALL: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
    total: 2,
    items: getMockItems(['2', '3']),
};

export const MOCK_CIVIC_OPEN_2: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
    total: 2,
    items: getMockItems(['2']),
};

export const MOCK_CIVIC_OPEN_3: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
    total: 2,
    items: getMockItems(['3']),
};
