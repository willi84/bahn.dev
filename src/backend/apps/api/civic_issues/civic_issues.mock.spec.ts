import { DATA_ITEMS } from '../endpoints/endpoints.d';
import { CIVIC_ISSUE_ITEM } from './civic_issues.d';
import {
    _getExpectedFromReports,
    getMockItems,
    MOCK_COORDS,
    MOCK_EXTENDED_ISSUES,
} from './civic_issues.mock';

describe('_getExpectedFromReports', () => {
    const FN = _getExpectedFromReports;
    it('should return expected data structure', () => {
        const item = MOCK_EXTENDED_ISSUES['1'];
        const geoID = `${item.coordinate.latitude}-${item.coordinate.longitude}`;
        const EXPECTED = {
            issues: { items: [item] },
            coords: {
                [geoID]: {
                    ...MOCK_COORDS[geoID],
                    count: 1,
                },
            },
        };
        // const reports = Object.values(MOCK_ISSUE_BY_ID).slice(0, 1);
        const reports: CIVIC_ISSUE_ITEM[] = getMockItems(['1']);
        const reportData: DATA_ITEMS<CIVIC_ISSUE_ITEM> = {
            items: reports,
            total: reports.length,
        };
        const result = FN(reportData);
        // const result = FN(reports);
        expect(result.issues.items.length).toEqual(1);
        expect(result).toEqual(EXPECTED);
    });
});
