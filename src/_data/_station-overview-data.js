const { getOpenStationAPI } = require('../backend/apps/stations/db-open-stations/db-open-stations.ts');
const { FS } = require('../backend/_shared/fs/fs.ts');
const { LAST_UPDATE_JSON } = require('../backend/apps/stations/config.ts');

const API_PATH = 'src/_data/api/OPEN_STATION_API.json';
let cachedApi;

const getFallbackApi = () => {
    if (!FS.hasFile(API_PATH)) {
        return {};
    }
    const data = FS.readFile(API_PATH, { noFixJSON: true });
    return data || {};
};

const ensureStationOverviewApi = () => {
    if (cachedApi) {
        return cachedApi;
    }
    const generatedApi = getOpenStationAPI();
    cachedApi = generatedApi || getFallbackApi();
    return cachedApi;
};

const ensureStationOverviewMeta = () => {
    ensureStationOverviewApi();
    if (!FS.hasFile(LAST_UPDATE_JSON)) {
        return {};
    }
    const meta = FS.readFile(LAST_UPDATE_JSON, { noFixJSON: true });
    return meta || {};
};

module.exports = {
    ensureStationOverviewApi,
    ensureStationOverviewMeta,
};
