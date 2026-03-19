export type COORD = {
    latitude: number;
    longitude: number;
};
export type PLACE = {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: {
        road?: string;
        suburb?: string;
        city?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
        [key: string]: string | undefined;
    };
    boundingbox: [string, string, string, string];
};
export type PLACE_RESPONSE = PLACE | { error: string };
export type PLACE_ITEM = {
    place: $PLACE;
    id: string;
    // count: number;
};
export type $PLACE = PLACE | null;
export type PLACE_FOUND_ITEM = {
    place: $PLACE;
    id: string;
    count: number;
};
export type GEO_ID = `${number}-${number}`;
export type GEO_REVERSE_ITEMS = {
    [key: GEO_ID]: PLACE;
};
export type FOUND_COORDS = {
    [key: string]: PLACE_FOUND_ITEM;
};
export type COORDS = {
    [key: string]: PLACE_ITEM;
};
export type STATE_COORD = 'found' | 'not_found' | 'cached';

export type UPDATE_COORD_RESULT = {
    state: STATE_COORD;
    request: number;
};
export type COORD_BY_ID = {
    [key: string]: COORD;
};
