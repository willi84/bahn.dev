/**
 * @jest-environment node
 */
import * as mock from 'mock-fs';
import * as fs from 'fs';
import * as updateModule from '../../../_shared/update/update';
import * as parseNetexModule from './parse-netex/parse-netex';
import { getOpenStationAPI } from './db-open-stations';

describe('getOpenStationAPI', () => {
    beforeEach(() => {
        jest.spyOn(updateModule, 'getXML').mockImplementation(() => undefined);
        jest.spyOn(updateModule, 'convertXMLToJSON').mockImplementation(() => undefined);
        jest.spyOn(parseNetexModule, 'getMetaData').mockReturnValue({});
        jest.spyOn(parseNetexModule, 'getRessources').mockReturnValue({});
    });

    afterEach(() => {
        jest.restoreAllMocks();
        mock.restore();
    });

    it('writes station detail files with URL-encoded DHID filenames', () => {
        mock({
            tmp: {
                'OPEN_STATION_API.xml': '<xml/>',
                'OPEN_STATION_API.json': '{}',
            },
            src: {
                _data: {
                    'meta.json': '{}',
                },
            },
            _site: {},
        });
        const dhid = 'dhid:de:16065:8012440:EdB';
        jest.spyOn(parseNetexModule, 'getStops').mockReturnValue({
            version: '1.0',
            keyList: {},
            frameRef: {},
            stops: {
                [dhid]: {
                    name: 'Berlin Ostbahnhof',
                },
            },
        });

        getOpenStationAPI();

        expect(
            fs.existsSync(
                `_site/station-overview/api/stations/${encodeURIComponent(dhid)}.json`
            )
        ).toBe(true);
        expect(
            fs.existsSync(`_site/station-overview/api/stations/${dhid}.json`)
        ).toBe(false);
        expect(fs.existsSync('_site/station-overview/api/index.html')).toBe(true);
    });

    it('always writes on-demand station metadata even if JSON generation fails', () => {
        mock({
            tmp: {
                'OPEN_STATION_API.xml': '<xml/>',
            },
            src: {
                _data: {
                    'meta.json': JSON.stringify({
                        OPEN_STATION_API: '2026-05-18T00:00:00.000Z',
                    }),
                },
            },
            _site: {},
        });
        jest.spyOn(parseNetexModule, 'getStops').mockReturnValue({
            version: '1.0',
            keyList: {},
            frameRef: {},
            stops: {},
        });

        const result = getOpenStationAPI();
        const meta = JSON.parse(
            fs.readFileSync('src/_data/meta.json', { encoding: 'utf8' })
        );

        expect(result).toBeUndefined();
        expect(meta.OPEN_STATION_API.stations.count).toBe(0);
        expect(meta.OPEN_STATION_API.api.path).toBe(
            '_site/station-overview/api/index.html'
        );
    });
});
