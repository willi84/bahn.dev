const data = require('./api/OPEN_STATION_API.json');

module.exports = Object.entries(data.stops || {}).map(([dhid, stop]) => ({
    dhid,
    stop,
    url_dhid: encodeURIComponent(dhid),
}));
