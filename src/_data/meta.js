const { getStationOverviewData } = require('./station_overview_data');

module.exports = getStationOverviewData().meta || {};
