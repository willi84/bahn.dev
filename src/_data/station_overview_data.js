const { FS } = require('../backend/_shared/fs/fs.ts');
const { LAST_UPDATE_JSON } = require('../backend/apps/stations/config.ts');
const { getOpenStationAPI } = require('../backend/apps/stations/db-open-stations/db-open-stations.ts');

let cache = null;
const OPEN_STATION_API_DATA_PATH = 'src/_data/api/OPEN_STATION_API.json';

const readApi = () =>
    FS.hasFile(OPEN_STATION_API_DATA_PATH)
        ? FS.readFile(OPEN_STATION_API_DATA_PATH, { noFixJSON: true })
        : null;

const readMeta = () =>
    FS.hasFile(LAST_UPDATE_JSON)
        ? FS.readFile(LAST_UPDATE_JSON, { noFixJSON: true })
        : {};

const getStationOverviewData = () => {
    if (cache) {
        return cache;
    }

    let api = readApi();
    let meta = readMeta();

    if (!api || !meta.OPEN_STATION_API) {
        const generatedApi = getOpenStationAPI();
        api = generatedApi || readApi() || {};
        meta = readMeta() || {};
    }

    cache = {
        api: api || {},
        meta: meta || {},
    };

    return cache;
};

module.exports = {
    getStationOverviewData,
};
