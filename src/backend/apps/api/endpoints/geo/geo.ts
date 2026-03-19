import { getResponse } from '../../../../_shared/http/http';
import { LOG } from '../../../../_shared/log/log';
import { substitute } from '../../../../_shared/tools/tools';
import { generateID, getJSON } from '../../_shared/utils/utils';
import { PLACE_ELEMENT, STREET } from '../../civic_issues/civic_issues.d';
import { ENDPOINT_NOMINATIM } from './geo.config';
import {
    PLACE,
    PLACE_ITEM,
    COORD,
    FOUND_COORDS,
    GEO_ID,
    UPDATE_COORD_RESULT,
    PLACE_RESPONSE,
    STATE_COORD,
    $PLACE,
} from './geo.d';

/**
 * 🎯 get the details to a geo position
 * @param {COOR} coord ➡️ The coordinate with latitude and longitude.
 * @returns {PLACE_ITEM} 📤 The address item with details.
 */
export const getReverseGeoData = (coord: COORD): PLACE_ITEM => {
    const details = getResponse(
        substitute(ENDPOINT_NOMINATIM.tmpl, {
            LAT: coord.latitude,
            LON: coord.longitude,
        }),
        { ua: ' -A "bahn.dev/1.0 (+https://bahn.dev; contact@example.com)" ' }
    );
    const cnt = details.content;
    const response: PLACE_RESPONSE = getJSON(cnt) as PLACE_RESPONSE;
    if (details.status !== '200' || response.hasOwnProperty('error')) {
        LOG.FAIL(
            `Failed to fetch coord data for item ${JSON.stringify(coord)}: ${details.status}`
        );
        LOG.DEBUG(JSON.stringify(details));
        return { id: '-1', place: null };
    }
    const id = getGeoID(coord);
    const place = response as PLACE;
    return { id, place };
};
/**
 * 🎯 get an ID from coords
 * @param {COOR} coord ➡️ The coordinate with latitude and longitude.
 * @returns {string} 📤 The geo ID.
 */
export const getGeoID = (coord: COORD): GEO_ID => {
    return `${coord.latitude}-${coord.longitude}`;
};

/**
 * 🎯 update foundCoords with new item
 * @param {COORD} coord ➡️ The coordinate with latitude and longitude.
 * @param {FOUND_COORDS} foundCoords ➡️ The found coords cache.
 * @returns {UPDATE_COORD_RESULT} 📤 The update result.
 */
export const updateCoordCache = (
    place: $PLACE,
    foundCoords: FOUND_COORDS
): UPDATE_COORD_RESULT => {
    if (place === null) {
        foundCoords['-1'] = {
            id: '-1',
            place: null,
            count: 1,
        };
        return { state: 'not_found', request: 0 };
    }
    const coord: COORD = {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
    };
    const geoID = getGeoID(coord);
    let state: STATE_COORD = 'cached';
    if (!foundCoords[`${geoID}`]) {
        foundCoords[`${geoID}`] = {
            id: geoID,
            place,
            count: 1,
        };
        state = 'found';
        return { state, request: 1 };
    } else {
        foundCoords[`${geoID}`].count += 1;
        return { state, request: 0 };
    }
};

/**
 * 🎯 get place data from coords, using cache or live and store in cache.
 * @param {COORD} coord ➡️ The coordinate with latitude and longitude.
 * @param {FOUND_COORDS} coords ➡️ The found coords cache.
 * @returns {PLACE_ELEMENT} 📤 The place element with state and place data.
 */
export const getPlaceFromCoord = (
    coord: COORD,
    coords: FOUND_COORDS
): PLACE_ELEMENT => {
    const geoID: GEO_ID = getGeoID(coord);
    let place: $PLACE = coords[geoID] ? coords[geoID].place : null;
    let state: UPDATE_COORD_RESULT = { state: 'not_found', request: 0 };
    if (place === null) {
        const geoData = getReverseGeoData(coord);
        place = geoData.place;
        if (place) {
            state = updateCoordCache(place, coords);
        } else {
            state = { state: 'not_found', request: 1 };
        }
    } else {
        state = updateCoordCache(place, coords);
        LOG.DEBUG(`📍 [CACHE] ${geoID}`);
    }
    return {
        state,
        place,
    };
};

/**
 * 🎯 get street data from place
 * @param {$PLACE} place ➡️ The place data or null.
 * @returns {STREET} 📤 The street data.
 */
export const getStreetFromPlace = (place: $PLACE): STREET => {
    let streetID = null;
    let streetName = null;
    if (place && place.address && place.address.road) {
        streetName = place?.address?.road;
        streetID = generateID(streetName, 'street');
    }
    return { streetID, streetName };
};
