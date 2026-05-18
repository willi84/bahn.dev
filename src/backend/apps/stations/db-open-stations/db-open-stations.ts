import { convertXMLToJSON, getXML } from '../../../_shared/update/update';
import { DATA_FILES, LAST_UPDATE_JSON } from '../config';
import { FS } from '../../../_shared/fs/fs';
import { colorize, LOG } from '../../../_shared/log/log';
import { getMetaData, getRessources, getStops } from './parse-netex/parse-netex';
import { colors } from '../../../_shared/colors';
import { ParseLogs } from './parse/parse-logs/parse-logs';

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
    const FILE_ITEMS = [
        { content: JSON.stringify(result, null, 2), path: `tmp/${key}_result.json` },
        { content: JSON.stringify(result), path: `tmp/${key}_result.min.json` },
        { content: JSON.stringify(result, null, 2), path: dataPath }
    ];
    for(const item of FILE_ITEMS){
        FS.writeFile(item.path, item.content);
        const PATH = colorize(item.path, '', colors.FgBlue, '');
        const SIZE = colorize(`${FS.sizeContent(item.content)} bytes`,'', colors.FgGreen, '');
        const KEY = colorize(key,'', colors.FgYellow, '');
        LOG.OK(`Written ${PATH} with size ${SIZE} for key: ${KEY}`);
    }

    const metaJSON: any = FS.hasFile(LAST_UPDATE_JSON) ? FS.readFile(LAST_UPDATE_JSON) : {};
    metaJSON[key] = {
        updated: result.updated,
        xml: {
            path: rawXMLPath,
            size: FS.hasFile(rawXMLPath) ? FS.size(rawXMLPath) : 0,
        },
        json: {
            path: dataPath,
            size: FS.hasFile(dataPath) ? FS.size(dataPath) : 0,
        },
    };
    FS.writeFile(LAST_UPDATE_JSON, JSON.stringify(metaJSON, null, 4));

    return result;
}
