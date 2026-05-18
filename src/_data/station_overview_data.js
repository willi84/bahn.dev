const { FS } = require('../backend/_shared/fs/fs.ts');
const { LAST_UPDATE_JSON } = require('../backend/apps/stations/config.ts');
const {
    getOpenStationAPI,
} = require('../backend/apps/stations/db-open-stations/db-open-stations.ts');

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
    const apiMissing = api === null || api === undefined;
    const metaMissing = !meta || meta.OPEN_STATION_API === undefined;

    if (apiMissing || metaMissing) {
        const generatedApi = getOpenStationAPI();
        // Fallback to reading the file in case generation wrote it but returned no value.
        const generatedFileApi = readApi();
        api = generatedApi || generatedFileApi || api || {};
        const generatedMeta = readMeta() || {};
        meta = generatedMeta;
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
