import { $PLACE, COORD, FOUND_COORDS } from './geo.d';
import {
    getGeoID,
    getPlaceFromCoord,
    getReverseGeoData,
    getStreetFromPlace,
    updateCoordCache,
} from './geo';
import { spyOnCMD } from '../../_shared/utils/utils';
import { MOCK_COORDS, MOCK_ISSUES } from '../../civic_issues/civic_issues.mock';
import { clone } from '../../../../_shared/tools/tools';
import { LOG } from '../../../../_shared/log/log';
import { DEFAULT_MOCK_COORD_ID, DEFAULT_MOCK_COORDS } from './geo.mock';

describe('✅ getReverseGeoData()', () => {
    const FN = getReverseGeoData;
    let spy: jest.SpyInstance;
    beforeEach(() => {
        spy = spyOnCMD();
    });
    afterEach(() => {
        spy.mockRestore();
        jest.clearAllMocks();
    });

    it('should get reverse geo data for correct corrds', () => {
        const coord: COORD = {
            latitude: 52.3856617,
            longitude: 13.1264399406723,
        };
        const id = getGeoID(coord);
        expect(FN(coord)).toEqual({
            id,
            place: MOCK_COORDS[id].place,
        });
    });
    it('should get no reverse geo data for wrong input', () => {
        const coord: COORD = {
            latitude: 1,
            longitude: 2,
        };
        const id = '-1';

        expect(FN(coord)).toEqual({ id, place: null });
    });
    it('should get no reverse geo data for wrong input', () => {
        const coord: COORD = {
            latitude: 52.3864838069139,
            longitude: 13.063328647394,
        };
        const id = '-1';
        expect(FN(coord)).toEqual({
            id,
            place: null,
        });
    });
});
describe('✅ getGeoID()', () => {
    const FN = getGeoID;
    it('should get geo ID from coords', () => {
        const coord: COORD = {
            latitude: 52.3864838069139,
            longitude: 13.063328647394,
        };
        expect(FN(coord)).toEqual('52.3864838069139-13.063328647394');
    });
});
describe('✅ updateCoordCache()', () => {
    const FN = updateCoordCache;
    it('should update coord cache with new coord', () => {
        const geoID = '52.3856617-13.1264399406723';
        const place: $PLACE = MOCK_COORDS[geoID].place;
        const foundCoords: any = {};
        const result = FN(place, foundCoords);
        expect(result.state).toEqual('found');
        expect(result.request).toEqual(1);
        expect(foundCoords[geoID]).toEqual({
            id: geoID,
            place,
            count: 1,
        });
    });
    it('should update coord cache with new coord', () => {
        const foundCoords: any = {};
        const result = FN(null, foundCoords);
        expect(result.state).toEqual('not_found');
        expect(result.request).toEqual(0);
        expect(foundCoords['-1']).toEqual({
            id: '-1',
            place: null,
            count: 1,
        });
    });
    it('should update coord cache with cached coord', () => {
        const geoID = '52.3856617-13.1264399406723';
        const place: $PLACE = MOCK_COORDS[geoID].place;
        const foundCoords: FOUND_COORDS = {
            [geoID]: {
                place,
                id: geoID,
                count: 1,
            },
        };
        const result = FN(place, foundCoords);
        expect(result.state).toEqual('cached');
        expect(result.request).toEqual(0);
        expect(foundCoords[geoID].count).toEqual(2);
        expect(foundCoords[geoID]).toEqual({
            place,
            id: geoID,
            count: 2,
        });
    });
});
describe('✅ getPlaceFromCoord()', () => {
    const FN = getPlaceFromCoord;
    let spy: jest.SpyInstance;
    let logSpy: jest.SpyInstance;
    let failSpy: jest.SpyInstance;
    let debugSpy: jest.SpyInstance;
    beforeEach(() => {
        logSpy = jest.spyOn(LOG, 'INFO');
        failSpy = jest.spyOn(LOG, 'FAIL');
        debugSpy = jest.spyOn(LOG, 'DEBUG');
        spy = spyOnCMD();
    });
    afterEach(() => {
        spy.mockRestore();
        jest.clearAllMocks();
        logSpy.mockRestore();
        failSpy.mockRestore();
        debugSpy.mockRestore();
        // readline.cursorTo(process.stdout, 0);
    });
    it('should return new place data from coord', () => {
        const coord = MOCK_ISSUES[1].coordinate;
        const id = `${coord.latitude}-${coord.longitude}`;
        const EXISTING_COORDS: FOUND_COORDS = clone(DEFAULT_MOCK_COORDS);
        const result = FN(coord, EXISTING_COORDS);
        const EXPECTED = {
            place: MOCK_COORDS[id].place,
            state: { state: 'found', request: 1 },
            // streetID: 'fakeplatz',
            // streetName: 'Fakeplatz',
        };
        expect(result).toEqual(EXPECTED);
    });
    it('should return existing place data from coord', () => {
        const coord = MOCK_ISSUES[0].coordinate;
        const id = `${coord.latitude}-${coord.longitude}`;
        const EXISTING_COORDS: FOUND_COORDS = clone(DEFAULT_MOCK_COORDS);
        const result = FN(coord, EXISTING_COORDS);
        const EXPECTED = {
            place: MOCK_COORDS[id].place,
            state: { state: 'cached', request: 0 },
        };
        expect(result).toEqual(EXPECTED);
    });
    it('should return null for unknown coords', () => {
        const coord = { latitude: 1, longitude: 2 };
        const EXISTING_COORDS: FOUND_COORDS = clone(DEFAULT_MOCK_COORDS);
        const result = FN(coord, EXISTING_COORDS);
        const EXPECTED = {
            place: null,
            state: { state: 'not_found', request: 1 },
        };
        expect(result).toEqual(EXPECTED);
    });
});

describe('✅ getStreetFromPlace()', () => {
    const FN = getStreetFromPlace;
    it('should return street data from place', () => {
        const place = MOCK_COORDS[DEFAULT_MOCK_COORD_ID].place;
        const result = FN(place);
        const EXPECTED = {
            streetID: 'wagnerstr',
            streetName: 'Wagnerstraße',
        };
        expect(result).toEqual(EXPECTED);
    });
    it('should return null street data from place=null', () => {
        const result = FN(null);
        const EXPECTED = {
            streetID: null,
            streetName: null,
        };
        expect(result).toEqual(EXPECTED);
    });
    it('should return null street data from place without road', () => {
        const place = clone(MOCK_COORDS[DEFAULT_MOCK_COORD_ID].place);
        delete place?.address.road;
        const result = FN(place);
        const EXPECTED = {
            streetID: null,
            streetName: null,
        };
        expect(result).toEqual(EXPECTED);
    });
});
