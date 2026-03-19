// import { REQUEST_PARAMS } from '../index.d';
// import { FS } from '../../../_shared/fs/fs';
// import { LOG } from '../../../_shared/log/log';
// import {
//     CIVIC_ISSUE_EXTENDED_ITEM,
//     CIVIC_ISSUE_ITEM,
//     CIVIC_ISSUE_STATE,
//     RAW_CIVIC_ISSUE_DATA,
//     UPDATE_DATA,
// } from './civic_issues.d';

// import { COORD, FOUND_COORDS } from '../endpoints/geo/geo.d';
// import { FILE_ITEM } from '../endpoints/endpoints.d';
// import { GET_LIVE_CIVIC_ISSUES_API } from '../../../config';
// import { generateID, sleepSync } from '../_shared/utils/utils';
// import { getGeoID, updateCoordCache } from '../endpoints/geo/geo';
// import { substitute } from '../../../_shared/tools/tools';
// import { getHttpBase } from '../../../_shared/http/http';
// import { HTTP_OPTS } from '../../../_shared/http/http.d';
// import { TMPL_CIVIC_ISSUES } from './civic_issues.config';

// export const getTargetItems = (requestConfig: REQUEST_PARAMS): object => {
//     // let maxItems: number = -1;
//     // let offset = 0;
//     let allData: any[] = [];
//     for (const state of requestConfig.STATES) {
//         const target = substitute(requestConfig.ENDPOINT, {
//             PROVIDER: requestConfig.PROVIDER,
//             STATE: state,
//             LIMIT: requestConfig.LIMIT,
//             // OFFSET: offset.toString(),
//             OFFSET: requestConfig.OFFSET_START.toString(),
//         });
//         // LOG.INFO(`Fetching data from ${target}...`);
//         // const opts = { type: ' application/json', timeout: '10.0'};
//         const opts: HTTP_OPTS = { method: 'GET', timeout: 10.0 };
//         // const opts = { method: 'GET', timeout: '10.0', ua: 'bahn.dev/1.0 (+https://bahn.dev;'};
//         const status = getHttpBase(target, opts);
//         LOG.OK(`HTTP Status for ${target}: ${status.status}`);
//         const data = getDataByAPI(target, opts) as any;
//         // console.log(target);
//         // console.log(data);
//         const maxItems = data[requestConfig.MAX_ITEMS];
//         const itemsByCategory = [];
//         // console.log(data)
//         if (Object.keys(data).length === 0) {
//             LOG.FAIL('Problem with fetching issue data');
//         }
//         itemsByCategory.push(...data[requestConfig.PROPERTY_DATESETS]);
//         const iterations = Math.ceil(
//             maxItems / parseInt(requestConfig.LIMIT, 10)
//         );
//         for (let i = 1; i < iterations; i++) {
//             const target2 = substitute(requestConfig.ENDPOINT, {
//                 PROVIDER: requestConfig.PROVIDER,
//                 STATE: state,
//                 LIMIT: requestConfig.LIMIT,
//                 OFFSET: i.toString(),
//                 // OFFSET: (offset * parseInt(requestConfig.LIMIT, 10)).toString(),
//             });
//             const data = getDataByAPI(target2) as any;
//             const items = data[requestConfig.PROPERTY_DATESETS];
//             itemsByCategory.push(...items);
//             LOG.OK(
//                 `received data [${i + 1}/${iterations}] with ${items.length} items ...`
//             );
//         }
//         // console.log('total items', itemsByCategory.length, 'maxItems', maxItems);
//         // offset = 0;
//         allData.push(...itemsByCategory);
//         LOG.OK(`Total items for state ${state}: ${itemsByCategory.length}`);
//     }
//     // console.log('all data items', allData.length);
//     return {
//         items: allData,
//         total: allData.length,
//     };
// };
// const cateories: CIVIC_ISSUE_STATE[] = [
//     'OPEN',
//     'CLOSED',
//     'NOT_RESPONSIBLE',
//     'IN_PROCESS',
// ];
// // const ENDPOINT = `{PROVIDER}/findPageableReportsWithFilter?filteredStates={STATE}&flawReporterId=3&limit={LIMIT}&offset={OFFSET}`;

// const REQUEST_CONFIG: REQUEST_PARAMS = {
//     MAX_ITEMS: 'totalCnt',
//     PROPERTY_DATESETS: 'reports',
//     KEY_OFFSET: 'OFFSET',
//     ENDPOINT: TMPL_CIVIC_ISSUES,
//     PROVIDER: 'PROVIDER',
//     STATES: cateories,
//     // LIMIT: '3',
//     OFFSET_START: 0,
//     LIMIT: '100',
// };

// export const getCivicIssuesData = (
//     foundCoords: FOUND_COORDS,
//     cache = true
// ): UPDATE_DATA => {
//     // try{
//     const ISSUES_FILE: FILE_ITEM = {
//         key: 'civic_issues',
//         path: `src/_data/raw/civic_issues.json`,
//         api: 'some/api',
//     };
//     const finalFile = `src/_data/repos/civic_issues.json`;
//     const demoFile = `src/_data/repos/civic_issues_demo.json`;
//     const finalFile2 = `src/_data/repos/civic_issues_2.json`;
//     const finalFileFinal = `src/_data/repos/civic_issues_final.json`;

//     const useDemoData = GET_LIVE_CIVIC_ISSUES_API === false;
//     const items: CIVIC_ISSUE_ITEM[] = [];
//     const key = REQUEST_CONFIG.PROPERTY_DATESETS as keyof RAW_CIVIC_ISSUE_DATA;
//     // console.log(key);
//     if (useDemoData) {
//         // const cachedItems: CIVIC_ISSUE_ITEM[] = getCachedByKey(demoFile, key);
//         // items.push(...cachedItems);
//         LOG.WARN(`Using demo data for civic issues! [${items.length}]`);
//     } else {
//         // const data: CIVIC_ISSUES_DATA = _getData(
//         //     ISSUES_FILE,
//         //     REQUEST_CONFIG,
//         //     cache
//         // ) as CIVIC_ISSUES_DATA;
//         // items.push(...data.items);
//     }
//     const result: { items: any[] } = {
//         items: [],
//         // total: data.total,
//     };

//     // reset foundCoords counting
//     for (const key of Object.keys(foundCoords)) {
//         foundCoords[key].count = 0;
//     }

//     const loadFresh = cache === true ? !FS.hasFile(finalFile) : true;
//     if (loadFresh) {
//         let requestedCnt = 0;
//         for (let i = 0; i < items.length; i++) {
//             const item: CIVIC_ISSUE_ITEM = items[i];
//             if ((requestedCnt + 1) % 50 === 0) {
//                 LOG.INFO(`Warte 3 Sekunden nach ${requestedCnt + 1} Items...`);
//                 sleepSync(3000);
//                 requestedCnt += 1; // to avoid double wait on next found
//             }
//             // const coordinate = item.coordinate;
//             const coord: COORD = item.coordinate;
//             const id = getGeoID(coord);
//             const place = foundCoords[`${id}`].place;
//             const updateResult = updateCoordCache(place, foundCoords);
//             if (updateResult.request > 0) {
//                 requestedCnt += updateResult.request;
//             }
//             const current = `[${i + 1}/${items.length}|${requestedCnt}]`;
//             if (updateResult.state === 'found') {
//                 LOG.OK(`🕵🏻 ${current} coord found ${id}`);
//             } else if (updateResult.state === 'not_found') {
//                 LOG.FAIL(`🕵🏻 ${current} coord NOT found ${id}`);
//             } else if (updateResult.state === 'cached') {
//                 LOG.INFO(`🚀 ${current} Skipping dup ${id}`);
//             }
//             let streetID = null;
//             let streetName = null;
//             if (place && place.address) {
//                 streetName = place.address.road || null;
//                 streetID = streetName ? generateID(streetName, 'street') : null;
//             } else {
//                 // item.streetID = null;
//             }
//             const allIDS = result.items.map((it) => it.id);
//             if (allIDS.includes(item.id)) {
//                 LOG.WARN(`Duplicate issue ID found: ${item.id}, skipping...`);
//                 continue;
//             } else {
//                 const finalData: CIVIC_ISSUE_EXTENDED_ITEM = {
//                     ...item,
//                     place,
//                     streetID,
//                     streetName,
//                     // streetID: address && address.address
//                 };
//                 result.items.push(finalData);
//             }
//         }
//         // write data and file
//         FS.writeFile(finalFile, result, 'replace', true);
//         // FS.writeFile(coordFile, foundCoords, 'replace', true);
//     } else {
//         LOG.INFO(`Civic issues data already exists: ${finalFile},skip fetch.`);
//     }
//     return { issues: result, coords: foundCoords };
//     // if (!FS.hasFile(finalFileFinal)) {
//     //     const finalData = FS.readFile(finalFile);
//     //     const dataItems = JSON.parse(finalData as string);
//     //     // console.log(dataItems.items[0]);
//     //     const finalResult = {
//     //         items: [],
//     //     };
//     //     // dataItems.items = dataItems.items || [];
//     //     const max = dataItems.items.length;
//     //     for (const item of dataItems.items) {
//     //         const address = item.address;
//     //         let streetID = null;
//     //         let streetName = null;
//     //         if (address && address.address) {
//     //             streetName = address.address.road || null;
//     //             // console.log('street name:', streetName);
//     //             streetID = streetName ? generateID(streetName) : null;
//     //             // if (streetID) {
//     //             //     item.streetID = streetID.id;
//     //             // } else {
//     //             //     item.streetID = null;
//     //             // }
//     //         } else {
//     //             item.streetID = null;
//     //         }
//     //         LOG.OK(`Processing item ${finalResult.items.length + 1}/${max}`);
//     //         finalResult.items.push({ ...item, streetID, streetName });
//     //         FS.writeFile(finalFileFinal, finalResult, 'replace', true);
//     //     }
//     //     return finalResult;
//     // } else {
//     //     LOG.INFO(`data of civic issues already exists: ${finalFileFinal}, skip fetch.`);
//     //     const finalData = FS.readFile(finalFileFinal);
//     //     const dataItems = JSON.parse(finalData as string);
//     //     return dataItems;
//     // }
// };
export {};

//================================== request ==================

// export const getDataByAPI = (target: string, opts = {}): object | string => {
//     const data = getResponse(target, opts);
//     // TODO: test else case
//     if (data && data.content !== undefined) {
//         try {
//             return JSON.parse(data.content);
//         } catch (e: any) {
//             LOG.FAIL(`Response is not JSON, return as string. (${e.message})`);
//             return data.content;
//         }
//     } else {
//         LOG.FAIL(`Failed to fetch data from ${target}`);
//         return {};
//     }
// };

/**
 * 🎯 get Data from file and return as object (!)
 * @param {string} filePath ➡️ The path to the file.
 * @returns {object} 📤 The data object.
 */
// export const ___getDataFromFile = (filePath: string): object => {
//     const demoData = FS.readFile(filePath);
//     if (!demoData) {
//         return {};
//     }
//     return typeof demoData !== 'object'
//         ? { content: demoData }
//         : (demoData as any);
// };

/**
 * 🎯 get Data either from live API or from file cache or demo data
 * @param {FILE_ITEM} targetFile ➡️ The target file item.
 * @param {DATA_MODE} mode ➡️ The data mode: 'live', 'cache', or 'demo'.
 * @returns {object} 📤 The data object.
 */
// export const getData = (targetFile: FILE_ITEM, mode: DATA_MODE): object => {
//     const target = mode === 'live' ? targetFile.api : targetFile.path;
//     const suffix = `for ${targetFile.key} from ${target}`;
//     switch (mode) {
//         case 'live':
//             LOG.INFO(`Mode: live ➡️ Fetching fresh data ${suffix} ...`);
//             const data = getDataByAPI(targetFile.api);
//             return data as object;
//         case 'cache':
//             LOG.INFO(`Mode: cache ➡️ Loading cached data ${suffix} ...`);
//             return ___getDataFromFile(targetFile.path);
//         case 'demo':
//             const demoPath = targetFile.path.replace('.json', '_demo.json');
//             LOG.INFO(
//                 `Mode: demo ➡️ Loading demo data ${suffix.replace('.json', '_demo.json')} ...`
//             );
//             return ___getDataFromFile(demoPath);
//         default:
//             LOG.FAIL(`Unknown data mode: ${mode}`);
//             return {};
//     }
// };

// export const getFreshData = (requestConfig: REQUEST_PARAMS): object => {
//     LOG.INFO(`Fetching fresh data from API...`);
//     const data: any = getTargetItems(requestConfig);
//     return data as object;
// };

// export const getCachedByKey = (filePath: string, key: string): any => {
//     const cachedData = FS.readFile(filePath);
//     return typeof cachedData === 'string'
//         ? (JSON.parse(cachedData)[key] as any)
//         : (cachedData as any)[key];
// };

// export const getCachedData = (
//     filePath: string,
//     config: DATA_CONFIG
// ): DATA_ITEMS => {
//     const cachedData = FS.readFile(filePath);
//     const raw =
//         typeof cachedData === 'object'
//             ? (cachedData as any)
//             : getJSON(cachedData);
//     const items = getItemsArray(raw, config);
//     return typeof cachedData === 'string'
//         ? (JSON.parse(cachedData) as any)
//         : (cachedData as any);
// };
/**
 * 🎯 get Data fresh or from cache
 * @param {FILE_ITEM} targetFile ➡️ The target file item.
 * @param {REQUEST_PARAMS} requestConfig ➡️ The request configuration.
 * @param {boolean} cache ➡️ Whether to use cache or fetch fresh data.
 * @returns {object} 📤 The data object.
 */
// export const _getData = (
//     // key: string,
//     targetFile: FILE_ITEM,
//     requestConfig: REQUEST_PARAMS,
//     cache: boolean
// ): object => {
//     const key = targetFile.key;
//     const file = targetFile.path;
//     // const file = `src/_data/raw/${key}.json`;
//     const hasFile = FS.hasFile(file);
//     const getFresh = cache === false ? true : hasFile === true ? false : true;

//     if (getFresh) {
//         LOG.INFO(`Fetching fresh data for ${key}...`);
//         const data: any = getFreshData(requestConfig);
//         // const data: any = getTargetItems(requestConfig);
//         FS.writeFile(file, data, 'replace', true);
//         return data as object;
//     } else {
//         LOG.INFO(`Loading cached data for ${key} from ${file}...`);
//         const cachedData = FS.readFile(file) as string;
//         // return cachedData as object;
//         return typeof cachedData === 'string'
//             ? (JSON.parse(cachedData) as any)
//             : (cachedData as any);
//     }
// };

// ============ endpoint.spec.ts ===================
// describe('__getDataFromFile()', () => {
//     const FN = ep.___getDataFromFile;
//     let failSpy: jest.SpyInstance;
//     beforeEach(() => {
//         failSpy = jest.spyOn(LOG, 'FAIL');
//         mock.restore();
//         mock({
//             raw: {
//                 'test_data.json': '{ "xxx": 99 }',
//                 'test_data.txt': 'sometext',
//             },
//         });
//     });
//     afterEach(() => {
//         mock.restore();
//         jest.clearAllMocks();
//         failSpy.mockRestore();
//         // readline.cursorTo(process.stdout, 0);
//     });
//     it('should load data from file correctly', () => {
//         const data = FN('raw/test_data.json');
//         expect(data).toEqual({ xxx: 99 });
//         expect(failSpy).toHaveBeenCalledTimes(0);
//     });
//     it('should load data from file correctly', () => {
//         const data = FN('raw/test_data.txt');
//         expect(data).toEqual({ content: 'sometext' });
//         expect(failSpy).toHaveBeenCalledTimes(0);
//     });
//     it('should return empty object when file does not exist', () => {
//         const data = FN('raw/non_existent_file.json');
//         expect(data).toEqual({});
//         expect(failSpy).toHaveBeenCalledTimes(1); // show error log
//     });
// });
// describe('✅ getCachedData()', () => {
// });
// describe('✅ getCachedByKey()', () => {
// });

// describe('✅ getData()', () => {
//     let spy: jest.SpyInstance;
//     let logSpy: jest.SpyInstance;
//     let failSpy: jest.SpyInstance;
//     const FN = getData;
//     beforeEach(() => {
//         logSpy = jest.spyOn(LOG, 'INFO');
//         failSpy = jest.spyOn(LOG, 'FAIL');
//         mock.restore();
//         mock({
//             raw: {
//                 'test_data.json': '{ xxx: 99 }',
//                 'test_data_demo.json': '{ xxx: 50 }',
//             },
//         });
//         spy = spyOnCMD();
//     });
//     afterEach(() => {
//         spy.mockRestore();
//         mock.restore();
//         jest.clearAllMocks();
//         logSpy.mockRestore();
//         failSpy.mockRestore();
//         // readline.cursorTo(process.stdout, 0);
//     });
//     describe('scenario: files and API exists', () => {
//         const testFile: FILE_ITEM = {
//             key: 'test_data',
//             path: 'raw/test_data.json',
//             api: ENDPOINT_CIVIC_ISSUES.test_api,
//         };
//         it('should load cached data when file exists', () => {
//             const data = FN(testFile, 'cache');
//             expect(data).toEqual({ xxx: 99 });
//             expect(spy).toHaveBeenCalledTimes(0);
//             expect(logSpy).toHaveBeenCalledWith(
//                 `Mode: cache ➡️ Loading cached data for ${testFile.key} from ${testFile.path} ...`
//             );
//             expect(failSpy).toHaveBeenCalledTimes(0);
//         });
//         it('should load cached data when file exists', () => {
//             const data = FN(testFile, 'demo');
//             const demoPath = testFile.path.replace('.json', '_demo.json');
//             expect(data).toEqual({ xxx: 50 });
//             expect(spy).toHaveBeenCalledTimes(0);
//             expect(logSpy).toHaveBeenCalledWith(
//                 `Mode: demo ➡️ Loading demo data for ${testFile.key} from ${demoPath} ...`
//             );
//             expect(failSpy).toHaveBeenCalledTimes(0);
//         });
//         it('should fetch live data when mode is live', () => {
//             const data: RAW_CIVIC_ISSUE_DATA = FN(
//                 testFile,
//                 'live'
//             ) as RAW_CIVIC_ISSUE_DATA;

//             expect(data?.reports.length).toEqual(1);
//             expect(data?.reports[0].category.categoryName).toEqual(
//                 'FAKE: Öffentliches Grün / Spielplatz'
//             );
//             expect(spy).toHaveBeenCalledTimes(1);
//             expect(logSpy).toHaveBeenCalledWith(
//                 `Mode: live ➡️ Fetching fresh data for ${testFile.key} from ${testFile.api} ...`
//             );
//             expect(failSpy).toHaveBeenCalledTimes(0);
//         });
//         it('should handle unknown mode gracefully', () => {
//             const data = FN(testFile, 'unknown' as any);
//             expect(data).toEqual({});
//             expect(spy).toHaveBeenCalledTimes(0);
//             expect(failSpy).toHaveBeenCalledWith(`Unknown data mode: unknown`);
//         });
//     });
//     describe('scenario: files and API not exists', () => {
//         const testFile: FILE_ITEM = {
//             key: 'unknown',
//             path: 'raw/unknown.json',
//             api: ENDPOINT_CIVIC_ISSUES.test_api,
//         };
//         it('should load cached data when file exists', () => {
//             const data = FN(testFile, 'cache');
//             expect(data).toEqual({});
//             expect(spy).toHaveBeenCalledTimes(0);
//             expect(logSpy).toHaveBeenCalledWith(
//                 `Mode: cache ➡️ Loading cached data for ${testFile.key} from ${testFile.path} ...`
//             );
//             expect(failSpy).toHaveBeenCalledTimes(1);
//         });
//         it('should load cached data when file exists', () => {
//             const data = FN(testFile, 'demo');
//             const demoPath = testFile.path.replace('.json', '_demo.json');
//             expect(data).toEqual({});
//             expect(spy).toHaveBeenCalledTimes(0);
//             expect(logSpy).toHaveBeenCalledWith(
//                 `Mode: demo ➡️ Loading demo data for ${testFile.key} from ${demoPath} ...`
//             );
//             expect(failSpy).toHaveBeenCalledTimes(1);
//         });
//         it('should fetch live data when mode is live', () => {
//             const data: RAW_CIVIC_ISSUE_DATA = FN(
//                 testFile,
//                 'live'
//             ) as RAW_CIVIC_ISSUE_DATA;
//             expect(data?.reports.length).toEqual(1);
//             expect(data?.reports[0].category.categoryName).toEqual(
//                 'FAKE: Öffentliches Grün / Spielplatz'
//             );
//             expect(spy).toHaveBeenCalledTimes(1);
//             expect(spy).toHaveBeenCalledTimes(1);
//             expect(logSpy).toHaveBeenCalledWith(
//                 `Mode: live ➡️ Fetching fresh data for ${testFile.key} from ${testFile.api} ...`
//             );
//             expect(failSpy).toHaveBeenCalledTimes(0);
//             // expect(failSpy).toHaveBeenCalledTimes(1);
//         });
//         it('should handle unknown mode gracefully', () => {
//             const data = FN(testFile, 'unknown' as any);
//             expect(data).toEqual({});
//             expect(spy).toHaveBeenCalledTimes(0);
//             expect(failSpy).toHaveBeenCalledWith(`Unknown data mode: unknown`);
//         });
//     });
// });

// describe('_getData()', () => {
//     beforeEach(() => {
//         mock.restore();
//         mock({
//             raw: {
//                 'test_data.json': '{ xxx: 99 }',
//             },
//         });
//     });
//     afterEach(() => {
//         mock.restore();
//         jest.clearAllMocks();
//         // readline.cursorTo(process.stdout, 0);
//     });
//     const FN = _getData;
//     const cateories: string[] = [
//         'OPEN',
//         'CLOSED',
//         'NOT_RESPONSIBLE',
//         'IN_PROCESS',
//     ];
//     const ENDPOINT = `{PROVIDER}/findPageableReportsWithFilter?filteredStates={STATE}&flawReporterId=3&limit={LIMIT}&offset={OFFSET}`;

//     const REQUEST_CONFIG: REQUEST_PARAMS = {
//         MAX_ITEMS: 'totalCnt',
//         PROPERTY_DATESETS: 'reports',
//         KEY_OFFSET: 'OFFSET',
//         ENDPOINT,
//         PROVIDER: 'https://FAKE.potsdam.de/backend/v1/flaw-reporter',
//         // PROVIDER: 'https://mitgestalten.potsdam.de/backend/v1/flaw-reporter',
//         STATES: cateories,
//         // LIMIT: '3',
//         OFFSET_START: 0,
//         LIMIT: '100',
//     };

//     const testFile: FILE_ITEM = {
//         key: 'test_data',
//         path: 'raw/test_data.json',
//         api: 'https://FAKE.api/test_data',
//     };
//     let spy: jest.SpyInstance;
//     // beforeEach(() => {
//     //     spy = jest.spyOn(ep, 'getFreshData').mockReturnValue({ xxx: 2 });
//     // });
//     afterEach(() => {
//         // spy.mockRestore();
//     });
//     describe('cache=false', () => {
//         const CACHE = false;
//         it('should fetch new data correctly', () => {
//             const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
//             // Ensure the test file does not exist before the test
//             if (FS.hasFile(testFile.path)) {
//                 FS.removeFile(testFile.path);
//             }
//             expect(FS.hasFile(testFile.path)).toBe(false);
//             const data1 = FN(testFile, requestConfig, CACHE);
//             expect(data1).toEqual({ xxx: 2 });
//             expect(FS.hasFile(testFile.path)).toBe(true);
//             expect(spy).toHaveBeenCalledTimes(1);
//         });
//         it('should not fetch cached data', () => {
//             const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
//             const data1 = FN(testFile, requestConfig, CACHE);
//             expect(FS.hasFile(testFile.path)).toBe(true);
//             expect(data1).toEqual({ xxx: 2 });
//             expect(FS.hasFile(testFile.path)).toBe(true);
//             expect(spy).toHaveBeenCalledTimes(1);
//         });
//     });
//     describe('cache=true', () => {
//         const CACHE = true;
//         it('should fetch new data correctly', () => {
//             const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
//             // Ensure the test file does not exist before the test
//             if (FS.hasFile(testFile.path)) {
//                 FS.removeFile(testFile.path);
//             }
//             expect(FS.hasFile(testFile.path)).toBe(false);
//             const data1 = FN(testFile, requestConfig, CACHE);
//             expect(data1).toEqual({ xxx: 2 });
//             expect(FS.hasFile(testFile.path)).toBe(true);
//             expect(spy).toHaveBeenCalledTimes(1);
//         });
//         it('should fetch cached data correctly', () => {
//             const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
//             const data1 = FN(testFile, requestConfig, CACHE);
//             expect(FS.hasFile(testFile.path)).toBe(true);
//             expect(data1).toEqual({ xxx: 99 });
//             expect(FS.hasFile(testFile.path)).toBe(true);
//             expect(spy).toHaveBeenCalledTimes(0);
//         });
//     });
// });
