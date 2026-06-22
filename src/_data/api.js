const { getStationOverviewData } = require('./station_overview_data');

module.exports = {
    OPEN_STATION_API: getStationOverviewData().api || {},
};
