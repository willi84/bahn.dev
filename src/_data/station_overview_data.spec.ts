const mockedGetOpenStationAPI = jest.fn();
const mockedHasFile = jest.fn();
const mockedReadFile = jest.fn();

jest.mock(
    '../backend/apps/stations/db-open-stations/db-open-stations.ts',
    () => ({
        getOpenStationAPI: (...args: unknown[]) =>
            mockedGetOpenStationAPI(...args),
    })
);

jest.mock('../backend/_shared/fs/fs.ts', () => ({
    FS: {
        hasFile: (...args: unknown[]) => mockedHasFile(...args),
        readFile: (...args: unknown[]) => mockedReadFile(...args),
    },
}));

describe('station_overview_data', () => {
    beforeEach(() => {
        jest.resetModules();
        mockedGetOpenStationAPI.mockReset();
        mockedHasFile.mockReset();
        mockedReadFile.mockReset();
    });

    test('does not trigger generation when both api and meta files exist', () => {
        const apiData = { stops: { a: { name: 'A' } } };
        const metaData = { OPEN_STATION_API: { updated: 'now' } };

        mockedHasFile.mockImplementation(
            (file: string) =>
                file === 'src/_data/api/OPEN_STATION_API.json' ||
                file === 'src/_data/meta.json'
        );
        mockedReadFile.mockImplementation((file: string) =>
            file === 'src/_data/api/OPEN_STATION_API.json' ? apiData : metaData
        );

        const { getStationOverviewData } = require('./station_overview_data');
        const result = getStationOverviewData();

        expect(result.api).toEqual(apiData);
        expect(result.meta).toEqual(metaData);
        expect(mockedGetOpenStationAPI).not.toHaveBeenCalled();
    });

    test('triggers on-demand generation when api/meta are missing', () => {
        const generatedApi = { stops: { b: { name: 'B' } } };
        const metaData = { OPEN_STATION_API: { updated: 'generated' } };

        mockedHasFile.mockImplementation(
            (file: string) => file === 'src/_data/meta.json'
        );
        mockedReadFile.mockImplementation(() => metaData);
        mockedGetOpenStationAPI.mockReturnValue(generatedApi);

        const { getStationOverviewData } = require('./station_overview_data');
        const result = getStationOverviewData();

        expect(mockedGetOpenStationAPI).toHaveBeenCalledTimes(1);
        expect(result.api).toEqual(generatedApi);
        expect(result.meta).toEqual(metaData);
    });

    test('triggers on-demand generation when api exists but meta is missing', () => {
        const existingApi = { stops: { c: { name: 'C' } } };
        const generatedApi = { stops: { d: { name: 'D' } } };
        const generatedMeta = {
            OPEN_STATION_API: { updated: 'generated-after-api-only' },
        };
        let hasGenerated = false;

        mockedHasFile.mockImplementation(
            (file: string) =>
                file === 'src/_data/api/OPEN_STATION_API.json' ||
                (hasGenerated && file === 'src/_data/meta.json')
        );
        mockedReadFile.mockImplementation((file: string) =>
            file === 'src/_data/api/OPEN_STATION_API.json'
                ? existingApi
                : generatedMeta
        );
        mockedGetOpenStationAPI.mockImplementation(() => {
            hasGenerated = true;
            return generatedApi;
        });

        const { getStationOverviewData } = require('./station_overview_data');
        const result = getStationOverviewData();

        expect(mockedGetOpenStationAPI).toHaveBeenCalledTimes(1);
        expect(result.api).toEqual(generatedApi);
        expect(result.meta).toEqual(generatedMeta);
    });

    test('returns cached result on repeated calls', () => {
        const apiData = { stops: { e: { name: 'E' } } };
        const metaData = { OPEN_STATION_API: { updated: 'cached' } };

        mockedHasFile.mockImplementation(
            (file: string) =>
                file === 'src/_data/api/OPEN_STATION_API.json' ||
                file === 'src/_data/meta.json'
        );
        mockedReadFile.mockImplementation((file: string) =>
            file === 'src/_data/api/OPEN_STATION_API.json' ? apiData : metaData
        );

        const { getStationOverviewData } = require('./station_overview_data');
        const first = getStationOverviewData();
        const second = getStationOverviewData();

        expect(first).toEqual(second);
        expect(mockedHasFile).toHaveBeenCalledTimes(2);
        expect(mockedReadFile).toHaveBeenCalledTimes(2);
        expect(mockedGetOpenStationAPI).not.toHaveBeenCalled();
    });
});
