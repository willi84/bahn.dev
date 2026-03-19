import {
    generateID,
    getContetByUrl,
    getJSON,
    getObject,
    getURL,
    sleepSync,
    sortBy,
    spyOnCMD,
} from './utils';
import * as cmd from '../../../../_shared/cmd/cmd';
import { CurlItem } from '../../../../index.d';
import { ENDPOINT_URL } from '../../civic_issues/civic_issues.config';
import { FAKE_LIST_RESULT_3 } from './utils.mock';
import { STATS } from '../../../../_shared/tools/tools.d';
import { ENDPOINT_NOMINATIM } from '../../endpoints/geo/geo.config';

describe('✅ generateID()', () => {
    it('should generate correct IDs', () => {
        const cases = [
            { input: 'Münchener Straße', expected: 'muenchener_strasse' },
            { input: 'Hauptstraße', expected: 'hauptstrasse' },
            { input: 'Bergstraße 12', expected: 'bergstrasse_12' },
            { input: 'My-Ebert-Allee', expected: 'my_ebert_allee' },
            { input: 'Königsweg!', expected: 'koenigsweg' },
            { input: 'Äußere Allee', expected: 'aeussere_allee' },
            { input: 'A___t______U', expected: 'a_t_u' },
            { input: '_Anfangsunterstrich', expected: 'anfangsunterstrich' },
            { input: 'Endungsunterstrich_', expected: 'endungsunterstrich' },
        ];

        for (const testCase of cases) {
            const result = generateID(testCase.input);
            expect(result).toBe(testCase.expected);
        }
    });
});
describe('✅ getURL()', () => {
    const FN = getURL;
    const URL = 'http://example.com/test';
    const URL2 = 'https://domain.de';
    const URL3 = 'FAKE.api/test';
    it('should return the same URL', () => {
        const url = 'http://example.com/test';
        const ua = `-A "domain.de/1.0 (+${URL2}; contact@example.com)" `;
        expect(FN(`${URL}`)).toEqual(url);
        expect(FN(`curl ${URL}`)).toEqual(url);
        expect(FN(`curl "${URL}"`)).toEqual(url);
        expect(FN(`curl '${URL}'`)).toEqual(url);
        expect(FN(`curl '${URL}' -m 0.5`)).toEqual(url);
        expect(FN(`curl \`${URL}\` -m 0.5`)).toEqual(url);
        // curl -s   -A "domain.de/1.0 (+https://domain.de; contact@example.com)"  -i "https://sub.foo.de/reverse?format=json&"
        expect(FN(`curl ${ua} \`${URL}\` -m 0.5`)).toEqual(url);
        expect(FN(`curl ${ua} \`${URL3}\` -m 0.5`)).toEqual(URL3);
    });
});

describe('✅ sortBy', () => {
    const FN = sortBy;
    it('should add all new Items with ID', () => {
        const existingItems = [{ id: 1 }, { id: 4 }];
        const newItems = [{ id: 2 }, { id: 3 }, { id: 4 }];
        const EXPECTED = [{ id: 1 }, { id: 4 }, { id: 2 }, { id: 3 }];
        const stats: STATS = FN(newItems, existingItems);
        expect(existingItems).toEqual(EXPECTED);
        expect(stats).toEqual({ added: 2, skipped: 1, failed: 0 });
    });
    it('should add all new Items with name', () => {
        const existingItems = [{ name: 'Alice' }, { name: 'Dave' }];
        const newItems = [{ name: 'Bob' }, { name: 'Dave' }];
        const EXPECTED = [{ name: 'Alice' }, { name: 'Dave' }, { name: 'Bob' }];
        const stats: STATS = FN(newItems, existingItems, 'name');
        expect(existingItems).toEqual(EXPECTED);
        expect(stats).toEqual({ added: 1, skipped: 1, failed: 0 });
    });
    it('should handle newItems without key', () => {
        const existingItems = [{ id: 1 }, { id: 2 }];
        const newItems: Array<{ id: number }> = [{ id: 1 }, { id: 3 }];
        const EXPECTED = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }];
        const stats: STATS = FN(newItems, existingItems, 'foo');
        expect(existingItems).toEqual(EXPECTED);
        expect(stats).toEqual({ added: 2, skipped: 0, failed: 0 });
    });
    it('should handle newItems without key', () => {
        const existingItems = [0, 1, 2, 3, 4];
        const newItems = [1, 5, 0];
        const EXPECTED = [0, 1, 2, 3, 4, 1, 5, 0];
        const stats: STATS = FN(newItems, existingItems, 'foo');
        expect(existingItems).toEqual(EXPECTED);
        expect(stats).toEqual({ added: 3, skipped: 0, failed: 0 });
    });
    it('should take care about values', () => {
        const existingItems = [{ id: 1 }, { id: 2 }];
        const newItems = [{ id: 0 }, { id: 3 }];
        const EXPECTED = [{ id: 1 }, { id: 2 }, { id: 0 }, { id: 3 }];
        const stats: STATS = FN(newItems, existingItems, 'id');
        expect(existingItems).toEqual(EXPECTED);
        expect(stats).toEqual({ added: 2, skipped: 0, failed: 0 });
    });
});

describe('✅ getContetByUrl()', () => {
    const FN = getContetByUrl;
    describe('geo reverse', () => {
        const API = `${ENDPOINT_NOMINATIM.reverse}?addressdetails=1&format=json`;
        it('should get address from geo reverse', () => {
            const result = FN(`${API}&lat=52.3856617&lon=13.1264399406723`);
            const json = JSON.parse(result);
            expect(json['osm_id']).toEqual('191232627');
            expect(json['error']).not.toBeDefined();
        });
        it('should not get address when missing parameter', () => {
            const result = FN(`${API}&lat=52.3856617`);
            const json = JSON.parse(result);
            expect(json['osm_id']).not.toBeDefined();
            expect(json['error']).toContain('🧪 MOCK: Missing lat/lon param');
        });
        it('should not get address', () => {
            const result = FN(`${API}&lat=52.41769595&lon=13.0409365`);
            const json = JSON.parse(result);
            expect(json['error']).toContain('🧪 MOCK: Unable to geocode');
        });
    });
    describe('civic issues', () => {
        const API = `${ENDPOINT_URL}/&limit=9999&offset=0&searchText=`;
        it('should get issues in process', () => {
            const result = FN(`${API}&filteredStates=IN_PROCESS`);
            const json = JSON.parse(result);
            expect(json['totalCnt']).toEqual(1);
            expect(json['reports'].length).toEqual(1);
            expect(json['reports'][0].state).toEqual('IN_PROCESS');
        });
        it('should get issues open', () => {
            const result = FN(`${API}&filteredStates=OPEN`);
            const json = JSON.parse(result);
            expect(json['totalCnt']).toEqual(2);
            expect(json['reports'].length).toEqual(2);
            expect(json['reports'][0].state).toEqual('OPEN');
        });
        it('should get all issues', () => {
            const result = FN(`${API}`);
            const json = JSON.parse(result);
            expect(json['totalCnt']).toEqual(4);
            expect(json['reports'].length).toEqual(4);
            expect(json['reports'][0].state).toEqual('IN_PROCESS');
            expect(json['reports'][1].state).toEqual('OPEN');
            expect(json['reports'][2].state).toEqual('OPEN');
            expect(json['reports'][3].state).toEqual('CLOSED');
        });
    });
    describe('fake endpoint', () => {
        it('should return key value for known fake endpoint', () => {
            const result = FN('http://FAKE.api/test');
            expect(result).toEqual(JSON.stringify(FAKE_LIST_RESULT_3));
        });
        it('should return empty result for empty fake endpoint', () => {
            const result = FN('http://FAKE.api/empty');
            expect(result).toEqual('');
        });
        it('should return error for unknown fake endpoint', () => {
            const result = FN('http://FAKE.api/unknown');
            expect(result).toEqual('<p>500 unknown error</p>');
        });
    });
    describe('unknown endpoint', () => {
        it('should get no result for unknown domain', () => {
            expect(FN('http://example.com')).toEqual('🧪 MOCK: NO_RESULT');
        });
    });
});
describe('✅ spyOnCMD()', () => {
    it('should mock cmd.command and return expected default', () => {
        const mockContent = '🧪 MOCK: NO_RESULT';
        const mockCommand = spyOnCMD();
        expect(mockCommand).toEqual(expect.any(Function));

        const result = cmd.command('curl http://example.com');
        expect(result).toContain(mockContent);

        mockCommand.mockRestore();
    });
    it('should mock cmd.command and return expected content', () => {
        const mockContent = JSON.stringify({ message: 'Hello, World!' });
        const mockCommand = spyOnCMD(mockContent, '200');

        const result = cmd.command('curl http://example.com');
        expect(result).toContain(mockContent);

        mockCommand.mockRestore();
    });
});
describe('✅ getObject()', () => {
    const FN = getObject;
    it('should parse valid JSON content', () => {
        const response = {
            content: JSON.stringify({ key: 'value', number: 42 }),
        } as CurlItem;
        const result = FN(response);
        expect(result).toEqual({ key: 'value', number: 42 });
    });
    it('should return empty object for empty content', () => {
        const response = {
            content: '',
        } as CurlItem;
        const result = FN(response);
        expect(result).toEqual({});
    });
});
describe('✅ sleepSync()', () => {
    const FN = sleepSync;
    it('should sleep for at least the specified time', () => {
        const sleepTime = 100; // milliseconds
        const start = Date.now();
        FN(sleepTime);
        const end = Date.now();
        const elapsed = end - start;
        expect(elapsed).toBeGreaterThanOrEqual(sleepTime);
    });
});
describe('✅ getJSON()', () => {
    const FN = getJSON;
    it('should parse valid JSON string', () => {
        const jsonString = '{"name":"John","age":30,"city":"New York"}';
        const result = FN(jsonString);
        expect(result).toEqual({ name: 'John', age: 30, city: 'New York' });
    });
    it('should handle invalid JSON string gracefully', () => {
        const invalidJsonString = '{"name":"John","age":30,"city":"New York"'; // Missing closing brace
        const result = FN(invalidJsonString);
        expect(result).toEqual({ error: 'Invalid JSON' });
    });
    it('should handle empty JSON string gracefully', () => {
        const emptyJsonString = '';
        const result = FN(emptyJsonString);
        expect(result).toEqual({ error: 'Invalid JSON' });
    });
});
