import { DEFAULT_HTTP_OPTS } from '../../../../_shared/http/http.config';
import { ENDPOINT_CONFIG } from '../data_items/data_items.d';

export const NOMINATIM_POLITIK = 'nominatim.politik.de';
export const NOMINATIM_OSM = 'nominatim.openstreetmap.org';
export const ENDPOINT_NOMINATIM_POL = `https://${NOMINATIM_POLITIK}/nominatim`;
export const ENDPOINT_NOMINATIM_OSM = `https://${NOMINATIM_OSM}`;
export const ENDPOINT_GEO_REVERSE = `${ENDPOINT_NOMINATIM_POL}/reverse`;

export const NOMINATIM_ENDPOINTS = {
    [NOMINATIM_POLITIK]: {
        endpoint: `https://${NOMINATIM_POLITIK}/nominatim`,
        reverse: `https://${NOMINATIM_POLITIK}/nominatim/reverse`,
        tmpl: `https://${NOMINATIM_POLITIK}/nominatim/reverse?lat={LAT}&lon={LON}&format=json`,
        key: NOMINATIM_POLITIK,
    },
    [NOMINATIM_OSM]: {
        endpoint: `https://${NOMINATIM_OSM}`,
        reverse: `https://${NOMINATIM_OSM}/reverse`,
        tmpl: `https://${NOMINATIM_OSM}/reverse?lat={LAT}&lon={LON}&format=json`,
        key: NOMINATIM_OSM,
    },
};
const NOMINATIM_TYPE = NOMINATIM_OSM;
// const NOMINATIM_TYPE = NOMINATIM_POLITIK;

export const ENDPOINT_NOMINATIM = NOMINATIM_ENDPOINTS[NOMINATIM_TYPE];

// export const REVERSE_GEOCODE_API =
//     // 'https://nominatim.openstreetmap.org/reverse?format=json&lat={LAT}&lon={LON}&addressdetails=1';
//     // 'https://nominatim.politik.de/nominatim/reverse?format=json&lat={LAT}&lon={LON}&addressdetails=1';
//     `${ENDPOINT_GEO_REVERSE}?format=json&lat={LAT}&lon={LON}&addressdetails=1`;

export const ENDPOINT_CONFIG_NOMINATIM: ENDPOINT_CONFIG = {
    endpoint: {
        key: ENDPOINT_NOMINATIM.key,
        // TODO: as correct tmpö
        tmpl: `${ENDPOINT_NOMINATIM.reverse}?lat=52.3856617&lon=13.1264399406723&format=json`,
        test_api: `${ENDPOINT_NOMINATIM.reverse}?lat=52.4&lon=13.1&format=json`,
        opts: DEFAULT_HTTP_OPTS,
    },
    data_config: {
        baseEndpoint: '',
        totalKey: '',
        itemsKey: '',
        idKey: '',
    },
};
