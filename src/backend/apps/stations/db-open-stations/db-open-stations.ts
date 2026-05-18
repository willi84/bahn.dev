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
    getXML(key, DATA_FILES, LAST_UPDATE_JSON);
    convertXMLToJSON(key, LAST_UPDATE_JSON);
    if(!FS.hasFile(`tmp/${key}.json`)) {
        LOG.FAIL(`JSON file not found for key: ${key}`);
        return;
    }
    LOG.DEBUG(`Reading JSON file for key: ${key}`);
    const json: any = FS.readFile(`tmp/${key}.json`, { noFixJSON: true});
    const logs: ParseLogs = new ParseLogs();
     const result: any = {
        updated: new Date().toISOString(),
        meta: getMetaData(json, logs),
        resources: getRessources(json, logs),
        stops: getStops(json, logs)
    };
    const DATA_PATH = 'src/_data/api';
    const FILE_ITEMS = [
        { content: JSON.stringify(result, null, 2), path: `tmp/${key}_result.json` },
        { content: JSON.stringify(result), path: `tmp/${key}_result.min.json` },
        { content: JSON.stringify(result), path: `${DATA_PATH}/${key}.json` }
    ];
    for(const item of FILE_ITEMS){
        FS.writeFile(item.path, item.content);
        const PATH = colorize(item.path, '', colors.FgBlue, '');
        const SIZE = colorize(`${FS.sizeContent(item.content)} bytes`,'', colors.FgGreen, '');
        const KEY = colorize(key,'', colors.FgYellow, '');
        LOG.OK(`Written ${PATH} with size ${SIZE} for key: ${KEY}`);
    }
    return result;
}