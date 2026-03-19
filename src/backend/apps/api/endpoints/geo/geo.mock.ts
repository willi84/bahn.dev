import { MOCK_COORDS } from '../../civic_issues/civic_issues.mock';
import { PLACE, GEO_REVERSE_ITEMS, FOUND_COORDS } from './geo.d';

export const OSM_LICENSE =
    'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright';

export const MOCK_ADDRESS_ITEMS: GEO_REVERSE_ITEMS = {
    '52.3856617-13.1264399406723': {
        ...(MOCK_COORDS['52.3856617-13.1264399406723'].place as PLACE),
        lat: '52.3856617',
        lon: '13.1264399406723',
    },
    '52.4556561-13.1005985': {
        ...(MOCK_COORDS['52.4556561-13.1005985'].place as PLACE),
        lat: '52.4556561',
        lon: '13.1005985',
    },
    '52.3995339-13.0624531': {
        ...(MOCK_COORDS['52.3995339-13.0624531'].place as PLACE),
        lat: '52.3995339',
        lon: '13.0624531',
    },
    '52.3997193-13.0628258': {
        ...(MOCK_COORDS['52.3997193-13.0628258'].place as PLACE),
        lat: '52.3997193',
        lon: '13.0628258',
    },
};

export const DEFAULT_MOCK_COORD_ID = '52.3856617-13.1264399406723';
export const DEFAULT_MOCK_COORDS: FOUND_COORDS = {
    [DEFAULT_MOCK_COORD_ID]: {
        ...MOCK_COORDS[DEFAULT_MOCK_COORD_ID],
        count: 1,
    },
};
