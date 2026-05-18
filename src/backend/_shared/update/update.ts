import { convertXML } from "simple-xml-to-json"
import { command } from '../cmd/cmd';
import { FS } from '../fs/fs';
import { LOG } from '../log/log';
import type { DATA_ITEM, DATA_ITEMS } from './update.d';
import type { $FileResult } from '../fs/fs.d';

export const getLastUpdate = (key: string, LAST_UPDATE_JSON: string) => {
    if(!FS.hasFile(LAST_UPDATE_JSON)) {
        return null;
    }
    const lastUpdateData: any = FS.readFile(LAST_UPDATE_JSON);
    if (lastUpdateData) {
        if(lastUpdateData[key]) {
            return lastUpdateData[key];
        }
    }
    return null;
};
export const setLastUpdate = (key: string, value: string, LAST_UPDATE_JSON: string) => {
    let data: any = {};
    if (FS.hasFile(LAST_UPDATE_JSON)) {
        data = FS.readFile(LAST_UPDATE_JSON);
    }
    data[key] = value;
    FS.writeFile(LAST_UPDATE_JSON, JSON.stringify(data, null, 4));
};
export const doUpdateCheck = (key: string, LAST_UPDATE_JSON: string, type = 'json'): boolean => {
    const lastUpdate = getLastUpdate(key, LAST_UPDATE_JSON);
    const longerThenOneDayAgo = lastUpdate ? (Date.now() - new Date(lastUpdate).getTime()) > 24 * 60 * 60 * 1000 : true;
    const hasFile = FS.hasFile(`tmp/${key}.${type}`);
    return hasFile ? longerThenOneDayAgo ? true : false : true;
}
export const getXML = (key: string, DATA_FILES: DATA_ITEMS, LAST_UPDATE_JSON: string) => {
    const dataItem: DATA_ITEM = DATA_FILES[key];
    if (!dataItem) {
        LOG.FAIL(`No data configuration found for key: ${key}`);
        return;
    }
    const tmpFilePath = `tmp/${key}.xml`;
    const url: string = dataItem.target;

    const shouldUpdate = doUpdateCheck(key, LAST_UPDATE_JSON, 'xml');
    if(shouldUpdate) {
        FS.createFolder('tmp');
        const cmd: string = `curl --compressed '${url}' > ${tmpFilePath}`;
        command(cmd);
        setLastUpdate(key, new Date().toISOString(), LAST_UPDATE_JSON);
        LOG.OK(`Netex data successfully fetched and saved to ${tmpFilePath}`);
    } else {
        const lastUpdate = getLastUpdate(key, LAST_UPDATE_JSON);
        LOG.INFO(`No need to fetch Netex data. Last update was on ${lastUpdate}.`);
    }

}
export const convertXMLToJSON = (key: string, LAST_UPDATE_JSON: string) => {
    const XML_PATH = `tmp/${key}.xml`;
    const JSON_PATH = `tmp/${key}.json`;
    if(!FS.hasFile(XML_PATH)) {
        LOG.FAIL(`XML file not found for key: ${key}`);
        return;
    }
    const xmlString: $FileResult = FS.readFile(XML_PATH);
    if(!xmlString) {
        LOG.FAIL(`Failed to read XML file for key: ${key}`);
        return;
    }
    const shouldUpdate = doUpdateCheck(key, LAST_UPDATE_JSON, 'json');
    if(shouldUpdate) {
        LOG.DEBUG(`Starting XML to JSON conversion for key: ${key}`);
        const json = convertXML(xmlString as string);
        LOG.DEBUG(`Converted XML to JSON for key: ${key}`);
        FS.writeFile(JSON_PATH, JSON.stringify(json));
        LOG.OK(`XML data successfully converted to JSON and saved to ${JSON_PATH}`);
    } else {
        const lastUpdate = getLastUpdate(key, LAST_UPDATE_JSON);
        LOG.INFO(`No need to convert XML to JSON. Last update was on ${lastUpdate}.`);
    }
}
