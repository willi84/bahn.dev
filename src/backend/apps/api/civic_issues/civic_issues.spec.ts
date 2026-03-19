import { LOG } from '../../../_shared/log/log';
import { spyOnCMD } from '../_shared/utils/utils';
import * as mock from 'mock-fs';
import * as utils from '../_shared/utils/utils';
import { FOUND_COORDS, GEO_ID } from '../endpoints/geo/geo.d';
import { getCivicIssues } from './civic_issues';
import {
    _getExpectedFromReports,
    getMockItem,
    getMockItems,
    MOCK_COORDS,
} from './civic_issues.mock';
import { clone } from '../../../_shared/tools/tools';
import {
    DEFAULT_MOCK_COORDS,
    DEFAULT_MOCK_COORD_ID,
} from '../endpoints/geo/geo.mock';
import { DATA_ITEMS } from '../endpoints/endpoints.d';
import { CIVIC_ISSUE_ITEM } from './civic_issues.d';

describe('🧪 with mock data', () => {
    let spy: jest.SpyInstance;
    let infoSpy: jest.SpyInstance;
    let failSpy: jest.SpyInstance;
    let debugSpy: jest.SpyInstance;
    beforeEach(() => {
        infoSpy = jest.spyOn(LOG, 'INFO');
        failSpy = jest.spyOn(LOG, 'FAIL');
        debugSpy = jest.spyOn(LOG, 'DEBUG');
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
    describe('✅ getCivicIssues()', () => {
        const FN = getCivicIssues;
        describe('should process civic issues data', () => {
            it('with geo coords from cache', () => {
                const EXIST_COORDS: FOUND_COORDS = clone(DEFAULT_MOCK_COORDS);
                const NEW_COORDS: FOUND_COORDS = clone(EXIST_COORDS);
                const GEO_ID: GEO_ID = DEFAULT_MOCK_COORD_ID;
                const rawData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
                    total: 1,
                    items: [getMockItem(GEO_ID)],
                };

                NEW_COORDS[GEO_ID].count = 2;
                const result = FN(EXIST_COORDS, rawData);
                const items = [
                    {
                        ...getMockItem(GEO_ID),
                        place: MOCK_COORDS[GEO_ID].place,
                        streetName: 'Wagnerstraße',
                        streetID: 'wagnerstr',
                    },
                ];
                const EXPECTED = {
                    issues: { items },
                    coords: NEW_COORDS,
                };
                expect(EXIST_COORDS[GEO_ID].count).toEqual(2);
                // important: make sure mocked API is called!!!!
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(debugSpy).toHaveBeenCalledWith(`📍 [CACHE] ${GEO_ID}`);
                expect(debugSpy).not.toHaveBeenCalledWith(
                    '🧪 MOCK: geo reverse: 1'
                );
                expect(result.issues).toEqual(EXPECTED.issues);
                expect(result.coords).toEqual(EXPECTED.coords);
            });
            it('with geo coords from API', () => {
                const EXIST_COORDS: FOUND_COORDS = clone(DEFAULT_MOCK_COORDS);
                const NEW_COORDS: FOUND_COORDS = clone(EXIST_COORDS);
                const GEO_ID = '52.4556561-13.1005985';
                NEW_COORDS[GEO_ID] = {
                    ...MOCK_COORDS[GEO_ID],
                    count: 1,
                };
                const rawData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
                    total: 1,
                    items: [getMockItem(GEO_ID)],
                };

                const result = FN(EXIST_COORDS, rawData);
                const items = [
                    {
                        ...getMockItem(GEO_ID),
                        place: MOCK_COORDS[GEO_ID].place,
                        streetName: 'Fakeplatz',
                        streetID: 'fakeplatz',
                    },
                ];
                const EXPECTED = {
                    issues: { items },
                    coords: NEW_COORDS,
                };
                expect(EXIST_COORDS[GEO_ID].count).toEqual(1);
                // important: make sure mocked API is called!!!!
                expect(debugSpy.mock.calls.length).toEqual(1);
                expect(debugSpy).toHaveBeenCalledWith(
                    '🧪 MOCK: geo reverse: 1'
                );
                expect(result.issues).toEqual(EXPECTED.issues);
                expect(result.coords).toEqual(EXPECTED.coords);
            });
        });
        describe('should NOT process civic issues data', () => {
            it('with wrong input', () => {
                const rawData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
                    items: [],
                    total: 0,
                };
                const EXIST_COORDS: FOUND_COORDS = clone(DEFAULT_MOCK_COORDS);
                const result = FN(EXIST_COORDS, rawData);
                const EXPECTED = {
                    issues: { items: [] },
                    coords: EXIST_COORDS,
                };
                // important: make sure mocked API is called!!!!
                expect(debugSpy.mock.calls.length).toEqual(0);
                expect(debugSpy).not.toHaveBeenCalledWith(
                    '🧪 MOCK: geo reverse: 1'
                );
                expect(result).toEqual(EXPECTED);
                expect(failSpy.mock.calls.length).toEqual(1);
                expect(failSpy).toHaveBeenCalledWith(
                    'No valid civic issues data'
                );
            });
        });
        describe('while requesting geo data', () => {
            let waitSpy: jest.SpyInstance;
            beforeEach(() => {
                waitSpy = jest
                    .spyOn(utils, 'sleepSync')
                    .mockImplementation(() => {
                        /* do nothing */
                    });
            });
            afterEach(() => {
                waitSpy.mockRestore();
            });
            it('wait when numIssuesWait is set', () => {
                const EXISTING_COORDS: FOUND_COORDS = {};
                const rawData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
                    total: 4,
                    items: getMockItems(['1', '2', '3', '4']),
                };
                const EXPECTED = _getExpectedFromReports(rawData);
                const config = { numIssuesWait: 3 };

                const result = FN(EXISTING_COORDS, rawData, config);
                // important: make sure mocked API is called!!!!
                expect(debugSpy.mock.calls.length).toEqual(5);
                expect(debugSpy).toHaveBeenCalledWith(
                    '🧪 MOCK: geo reverse: 1'
                );
                expect(debugSpy).toHaveBeenCalledWith('[3/4] ⏳ Wait 3s...');
                expect(waitSpy.mock.calls.length).toEqual(1);
                expect(result.coords).toEqual(EXPECTED.coords);
                expect(result.issues.items.length).toEqual(4);
                expect(result.issues).toEqual(EXPECTED.issues);
            });
            it('not wait when numIssuesWait is set higher', () => {
                const EXISTING_COORDS: FOUND_COORDS = {};
                const rawData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
                    total: 4,
                    items: getMockItems(['1', '2', '3', '4']),
                };
                const EXPECTED = _getExpectedFromReports(rawData);
                const config = {};
                const result = FN(EXISTING_COORDS, rawData, config);
                // important: make sure mocked API is called!!!!
                expect(debugSpy.mock.calls.length).toEqual(4);
                expect(debugSpy).toHaveBeenCalledWith(
                    '🧪 MOCK: geo reverse: 1'
                );
                expect(debugSpy).not.toHaveBeenCalledWith(
                    '[3/4] ⏳ Wait 3s...'
                );
                expect(waitSpy.mock.calls.length).toEqual(0);
                expect(result.coords).toEqual(EXPECTED.coords);
                expect(result.issues.items.length).toEqual(4);
                expect(result.issues).toEqual(EXPECTED.issues);
            });
            it('not wait when everything is from cache', () => {
                const rawData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
                    total: 4,
                    items: getMockItems(['1', '2', '3', '4']),
                };
                const EXPECTED = _getExpectedFromReports(rawData);
                // const EXPECTED = _getExpectedFromReports(rawData.items);

                // 🧪 1. clone from originally expected
                const EXISTING_COORDS: FOUND_COORDS = clone(EXPECTED.coords);

                // 🧪 2. set everything to 1
                for (const geoID in EXISTING_COORDS) {
                    EXISTING_COORDS[geoID].count = 1;
                }
                const config = { numIssuesWait: 3 };
                const result = FN(EXISTING_COORDS, rawData, config);

                // 🧪 3. update expected counts
                for (const geoID in EXPECTED.coords) {
                    EXPECTED.coords[geoID].count += 1;
                }
                // important: make sure mocked API is called!!!!
                expect(debugSpy.mock.calls.length).toEqual(4);
                expect(debugSpy).not.toHaveBeenCalledWith(
                    '🧪 MOCK: geo reverse: 1'
                );
                expect(debugSpy).toHaveBeenCalledWith(
                    '📍 [CACHE] 52.3856617-13.1264399406723'
                );
                // relevant test: no wait called for cached items
                expect(debugSpy).not.toHaveBeenCalledWith(
                    '[3/4] ⏳ Wait 3s...'
                );
                expect(waitSpy.mock.calls.length).toEqual(0);

                expect(result.coords).toEqual(EXPECTED.coords);
                expect(result.issues.items.length).toEqual(4);
                expect(result.issues).toEqual(EXPECTED.issues);
            });
        });
    });
});
