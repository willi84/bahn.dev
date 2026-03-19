import { LOG } from '../../../_shared/log/log';
import { getPlaceFromCoord, getStreetFromPlace } from '../endpoints/geo/geo';
import { FOUND_COORDS } from '../endpoints/geo/geo.d';
import {
    // RAW_CIVIC_ISSUE_DATA,
    CIVIC_ISSUE_EXTENDED_ITEM,
    CIVIC_ISSUE_ITEM,
    UPDATE_DATA,
    CIVIC_ISSUES_DATA_EXTENDED,
    CONFIG_WAITING,
} from './civic_issues.d';
import { DATA_ITEMS, DATA_MODE } from '../endpoints/endpoints.d';
import { sleepSync } from '../_shared/utils/utils';
import { loadItems } from '../endpoints/data_items/data_items';
import {
    CONFIG_CIVIC_ISSUES_DATA,
    ENDPOINT_CIVIC_ISSUES,
} from './civic_issues.config';
import { ENDPOINT_CONFIG } from '../endpoints/data_items/data_items.d';

// TODO: write to cache or demo

/**
 * 🎯 get civic issues with extended data
 * @param {FOUND_COORDS} coords ➡️ The found coordinates cache.
 * @param {DATA_ITEMS} rawData ➡️ The raw civic issue data.
 * @param {CONFIG_WAITING} config ➡️ The configuration for fetching civic issues.
 * @returns {UPDATE_DATA} 📤 The updated civic issues data with extended information.
 */
export const getCivicIssues = <T>(
    coords: FOUND_COORDS,
    rawData: DATA_ITEMS<T>,
    config: CONFIG_WAITING = {}
    // api_config: API_CONFIG
): UPDATE_DATA => {
    const issues: CIVIC_ISSUES_DATA_EXTENDED = { items: [] };
    let numIssuesWait = config.numIssuesWait || 50;
    let waitTimeMS = config.waitTimeMS || 3000;

    const rawIssues: DATA_ITEMS<CIVIC_ISSUE_ITEM>['items'] =
        rawData.items as CIVIC_ISSUE_ITEM[];
    if (!rawIssues || rawIssues.length === 0) {
        LOG.FAIL('No valid civic issues data');
        return { issues, coords };
    }
    LOG.OK(`Total civic issues fetched: ${rawIssues.length}`);
    // TODO:  get Details of civic issue
    // TODO:  detects updates
    let requestedCnt = 0;
    for (const issue of rawIssues) {
        if ((requestedCnt + 1) % numIssuesWait === 0) {
            const current = `${requestedCnt + 1}/${rawIssues.length}`;
            LOG.DEBUG(`[${current}] ⏳ Wait ${waitTimeMS / 1000}s...`);
            sleepSync(waitTimeMS);
            // requestedCnt += 1; // to avoid double wait on next found
        }
        const { place, state } = getPlaceFromCoord(issue.coordinate, coords);
        const street = getStreetFromPlace(place);
        const extendedItem: CIVIC_ISSUE_EXTENDED_ITEM = {
            ...(issue as CIVIC_ISSUE_ITEM),
            place,
            ...street,
        };

        issues.items.push(extendedItem);
        requestedCnt += state.request;

        // stats
        switch (state.state) {
            case 'found':
                LOG.OK(`🕵🏻 coord found for issue ID ${issue.id}`);
                break;
            case 'not_found':
                LOG.FAIL(`🕵🏻 coord NOT found for issue ID ${issue.id}`);
                break;
            case 'cached':
                LOG.INFO(`🚀 Skipping dup coord for issue ID ${issue.id}`);
                break;
        }
    }
    return { issues, coords };
};
export const loadCivicIssues = (mode: DATA_MODE): void => {
    type T = DATA_ITEMS<CIVIC_ISSUE_ITEM>;
    const ENDPOINT: ENDPOINT_CONFIG = {
        endpoint: ENDPOINT_CIVIC_ISSUES,
        data_config: CONFIG_CIVIC_ISSUES_DATA,
    };
    const result: DATA_ITEMS<CIVIC_ISSUE_ITEM> = <T>loadItems(mode, ENDPOINT);
};
// check

// https://mitgestalten.potsdam.de/backend/v1/flaw-reporter/findPageableReportsWithFilter?filteredStates=CLOSED&filteredStates=OPEN&filteredStates=IN_PROCESS&filteredStates=NOT_RESPONSIBLE&flawReporterId=3&limit=9&offset=0&searchText=
// totalCnt
