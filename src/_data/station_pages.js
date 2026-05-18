const data = require('./api/OPEN_STATION_API.json');

const isDev = process.env.NODE_ENV !== 'production';
const DEV_LIMIT = 25;
const dhids = Object.keys(data.stops || {});
const selectedDhids = isDev ? dhids.slice(0, DEV_LIMIT) : dhids;

module.exports = selectedDhids.map((dhid) => ({
    dhid,
    url_dhid: encodeURIComponent(dhid),
}));
