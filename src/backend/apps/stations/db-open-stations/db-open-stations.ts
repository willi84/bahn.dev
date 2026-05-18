import { convertXMLToJSON, getXML } from '../../../_shared/update/update';
import { DATA_FILES, LAST_UPDATE_JSON } from '../config';
import { FS } from '../../../_shared/fs/fs';
import { colorize, LOG } from '../../../_shared/log/log';
import { getMetaData, getRessources, getStops } from './parse-netex/parse-netex';
import { colors } from '../../../_shared/colors';
import { ParseLogs } from './parse/parse-logs/parse-logs';

const toKB = (bytes: number) => Number((bytes / 1024).toFixed(2));
const toMB = (bytes: number) => Number((bytes / (1024 * 1024)).toFixed(2));
const toReductionPercent = (originalBytes: number, reducedBytes: number) => {
    if (!originalBytes || originalBytes <= 0) {
        return 0;
    }
    return Number((((originalBytes - reducedBytes) / originalBytes) * 100).toFixed(2));
};

/**
 * get extract of the original JSON with only 5 stops for testing and development purposes
 */
export const getOptimizedJSON = () => {
    const key = 'OPEN_STATION_API';
    const json: any = FS.readFile(`tmp/${key}.json`, { noFixJSON: true});
    const newJSON = { ...json};
    const pubDelivery = json?.PublicationDelivery;
    const children = pubDelivery?.children;
    for (const child of children) {
        const children = child?.dataObjects?.children;
        if (children) {
            for (const dataObject of children) {
                const frame = dataObject.CompositeFrame;
                if(frame){
                    const stops = frame.children[3].frames.children[0].SiteFrame.children[2].stopPlaces.children;

                    const newStops = [];
                    let i = 0;
                    for(const stop of stops){
                        if(i < 5) {
                            newStops.push(stop);
                        }
                        i += 1;
                    }
                    const items = newJSON?.PublicationDelivery.children[2].dataObjects.children[0].CompositeFrame.children[3].frames.children[0].SiteFrame.children[2].stopPlaces
                    items.children = [...newStops];
                }
            }
        }
    }
    FS.writeFile(`tmp/${key}_small.json`, JSON.stringify( newJSON, null, 2 ))
}

export const getOpenStationAPI = () => {
    const key = 'OPEN_STATION_API';
    const rawXMLPath = `tmp/${key}.xml`;
    const rawJSONPath = `tmp/${key}.json`;
    const dataPath = `src/_data/api/${key}.json`;
    const siteApiPath = `_site/station-overview/api/index.html`;
    const siteStationsPath = `_site/station-overview/api/stations`;

    getXML(key, DATA_FILES, LAST_UPDATE_JSON);
    convertXMLToJSON(key, LAST_UPDATE_JSON);
    if(!FS.hasFile(rawJSONPath)) {
        LOG.FAIL(`JSON file not found for key: ${key}`);
        return;
    }
    LOG.DEBUG(`Reading JSON file for key: ${key}`);
    const json: any = FS.readFile(rawJSONPath, { noFixJSON: true});
    const logs: ParseLogs = new ParseLogs();
    const stopData = getStops(json, logs);
    const result: any = {
        updated: new Date().toISOString(),
        meta: getMetaData(json, logs),
        resources: getRessources(json, logs),
        stopsMeta: {
            version: stopData.version,
            keyList: stopData.keyList,
            frameRef: stopData.frameRef,
        },
        stops: stopData.stops,
    };
    const resultPretty = JSON.stringify(result, null, 2);
    const resultMinified = JSON.stringify(result);

    const FILE_ITEMS = [
        { content: resultPretty, path: `tmp/${key}_result.json` },
        { content: resultMinified, path: `tmp/${key}_result.min.json` },
        { content: resultPretty, path: dataPath },
        { content: JSON.stringify({ data: result }, null, 2), path: siteApiPath }
    ];
    for(const item of FILE_ITEMS){
        FS.writeFile(item.path, item.content);
        const PATH = colorize(item.path, '', colors.FgBlue, '');
        const SIZE = colorize(`${FS.sizeContent(item.content)} bytes`,'', colors.FgGreen, '');
        const KEY = colorize(key,'', colors.FgYellow, '');
        LOG.OK(`Written ${PATH} with size ${SIZE} for key: ${KEY}`);
    }
    LOG.DEBUG(`[stations] aggregate api file ${FS.hasFile(siteApiPath) ? 'exists' : 'missing'}: ${siteApiPath}`);

    const stops = result.stops || {};
    const stopFileSizesKB: Record<string, number> = {};
    for (const dhid in stops) {
        const stop = stops[dhid];
        const encodedDhid = encodeURIComponent(dhid);
        const stopFilePath = `${siteStationsPath}/${encodedDhid}.json`;
        const stopContent = JSON.stringify({ dhid, data: stop }, null, 2);
        FS.writeFile(stopFilePath, stopContent);
        stopFileSizesKB[dhid] = toKB(FS.sizeContent(stopContent));
        LOG.DEBUG(`[stations] detail api file ${FS.hasFile(stopFilePath) ? 'exists' : 'missing'}: ${stopFilePath}`);
    }

    const xmlSizeBytes = FS.hasFile(rawXMLPath) ? FS.size(rawXMLPath) : 0;
    const jsonSizeBytes = FS.hasFile(dataPath) ? FS.size(dataPath) : 0;
    const siteApiSizeBytes = FS.hasFile(siteApiPath) ? FS.size(siteApiPath) : 0;
    const reductionPercent = toReductionPercent(xmlSizeBytes, jsonSizeBytes);

    const metaJSON: any = FS.hasFile(LAST_UPDATE_JSON) ? FS.readFile(LAST_UPDATE_JSON) : {};
    metaJSON[key] = {
        updated: result.updated,
        xml: {
            path: rawXMLPath,
            size: xmlSizeBytes,
            sizeMB: toMB(xmlSizeBytes),
        },
        json: {
            path: dataPath,
            size: jsonSizeBytes,
            sizeMB: toMB(jsonSizeBytes),
        },
        api: {
            path: siteApiPath,
            size: siteApiSizeBytes,
            sizeMB: toMB(siteApiSizeBytes),
            reductionFromXMLPercent: reductionPercent,
        },
        stations: {
            path: siteStationsPath,
            count: Object.keys(stops).length,
            itemSizeKB: stopFileSizesKB,
        },
    };
    FS.writeFile(LAST_UPDATE_JSON, JSON.stringify(metaJSON, null, 4));

    return result;
}
