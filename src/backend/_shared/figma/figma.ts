import { command, commandSafe } from './../cmd/cmd';
import { FS } from './../fs/fs';
import { LOG } from './../log/log';
import { substitute } from './../tools/tools';
import {
    FIGMA_FILE,
    FIGMA_FILE_VERSION,
    FIGMA_ERROR_GET_VERSIONS,
    FIGMA_GET_IMAGES,
} from './figma.config';
import { DOWNLOAD_ITEM, FIGMA_CONFIG, IconItem, IconNode } from './figma.d';
import { API_RESULT, JsonObject } from '../../index.d';
import { getResponse } from '../http/http';
export const FIGMA_FILE_LOCAL = './figma.json';

export const getFigmaApi = (target: string, config: JsonObject): API_RESULT => {
    let result: API_RESULT = { data: {} };
    const cmd = substitute(target, config);
    console.log(cmd);
    const response = command(cmd);
    let json: JsonObject = {};
    try {
        json = JSON.parse(response);
    } catch (e: any) {
        LOG.FAIL(`Error parsing Figma API response: ${e?.message}`);
        LOG.INFO(response);
        json = {};
        result.err = FIGMA_ERROR_GET_VERSIONS;
    }
    result['data'] = json;

    return result;
};

export const getRemoteVersion = (config: FIGMA_CONFIG): string | null => {
    const response = getFigmaApi(FIGMA_FILE_VERSION, config);
    const json = response.data;
    if (json.err) {
        // console.log(json.err);
        LOG.FAIL(`Error getting Figma file version: ${json.err}`);
        return null;
    }
    if (json && json.versions && json.versions.length > 0) {
        const getLastCreationDate = (a: any, b: any) => {
            return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
        };
        const result = json.versions.sort(getLastCreationDate);
        // get the first version (most recent)
        const version = result[0].id;
        LOG.OK(`Figma file version: ${version}`);
        return version;
    } else {
        LOG.FAIL('No versions found for the Figma file.');
        return null;
    }
};
export const getLocalVersion = (file: string): string | null => {
    const hasFile = FS.exists(file);
    if (!hasFile) {
        LOG.WARN(`Local Figma file does not exist: ${file}`);
        return null;
    }
    const json: any = FS.readFile(file, {});
    if (json && json.version) {
        const version = json.version;
        LOG.OK(`Local Figma file version: ${version}`);
        return version;
    } else {
        LOG.WARN('⚠️ No version found in the local Figma file.');
        return null;
    }
};
export const getFile = (config: FIGMA_CONFIG, filePath: string): any => {
    const cmd = substitute(`${FIGMA_FILE}?depth=4`, config);
    console.log(cmd);
    const result = commandSafe(cmd);
    // const result = command(cmd);
    // const MAX = 1_000_000; // 1 MB


    const json = JSON.parse(result);
    // FS.writeFile(filePath, result);
    FS.writeFile(filePath, JSON.stringify(json, null, 2));
    // FS.writeFile(filePath, JSON.stringify(json, null, 2));
    LOG.OK(`💾 Figma file (${json.version}) downloaded successfully.`);
    return json;
};
export const getFileContent = (config: FIGMA_CONFIG): JsonObject => {
    console.log('Checking Figma file versions...');
    const remoteVersion = getRemoteVersion(config);
    if (!remoteVersion) {
        LOG.FAIL('No remote version found. Exiting...');
        // return {};
    }
    const localVersion = getLocalVersion('./figma.json');
    let json: JsonObject = {};
    if (remoteVersion === null && localVersion === null) {
        LOG.FAIL('❌ No remote and local version found. Exiting...');
        json = { err: FIGMA_ERROR_GET_VERSIONS };
    } else if (remoteVersion === null) {
        LOG.FAIL('No remote version found. Take Local...');
        json = FS.readFile(FIGMA_FILE_LOCAL, {});
    } else if (remoteVersion !== localVersion) {
        LOG.WARN('⚠️ Remote and local versions do not match. Updating...');
        json = getFile(config, FIGMA_FILE_LOCAL);
    } else {
        LOG.OK(`✅ Remote and local versions match: ${remoteVersion}`);
        json = FS.readFile(FIGMA_FILE_LOCAL, {});
    }
    return json;
};

export const generateIcons = (
    config: FIGMA_CONFIG,
    iconNodes: IconNode[],
    prefix: string,
    keepPrefix = true
    // prefix = 'ICON-'
): IconItem[] => {
    const ids = iconNodes.map((node) => node.id);
    const conf = { ...config, IDS: ids.join(',') };
    const response = getFigmaApi(FIGMA_GET_IMAGES, conf);
    const result: IconItem[] = [];
    const json = response.data;
    if (!json || json.err || !json.images) {
        LOG.FAIL(`Error getting icons: ${json.err || 'No images found'}`);
        return result;
    }
    // console.log(json.images)
    for (const iconNode of iconNodes) {
        const key = iconNode.id;
        const imagePath = json.images[key];
        if (!imagePath) {
            LOG.WARN(`No image found for key: ${key}`);
            continue;
        } else {

            const name = iconNode.name;
            const regPrefix = new RegExp(`^${prefix}`);
            const filename = keepPrefix ? `${name}.svg` : `${name.replace(regPrefix, '')}.svg`;
            result.push({
                id: key,
                name,
                filename,
                type: 'icon',
                group: 'icons',
                url: imagePath,
            });
        }
    }
    return result;
};
export const downloadIcons = (icons: IconItem[], targetFolder: string) => {
    const hasFolder = FS.exists(targetFolder);
    if (!hasFolder) {
        LOG.WARN(`Target folder does not exist: ${targetFolder}`);
        FS.createFolder(targetFolder);
        LOG.OK(`Target folder created: ${targetFolder}`);
    }
    const result: DOWNLOAD_ITEM[] = [];
    for (const icon of icons) {
        const localPath = `${targetFolder}/${icon.filename}`;
        // const value = command(`curl -s ${icon.url}`); //no progress bar
        const response = getResponse(icon.url, {});
        console.log(icon.url)
        FS.writeFile(localPath, response.content, 'replace', true);
        LOG.OK(`💾 Icon ${icon.name} downloaded successfully`);
        result.push({
            id: icon.id,
            name: icon.name,
            filename: icon.filename,
            type: icon.type,
            group: icon.group,
            url: icon.url,
            localPath,
            httpStatus: response.status,
            // httpStatus: response.header.status,
        });
    }
    return result;
};
export const getIconItem = (item: any, group: string): IconItem => {
    return {
        name: item.name,
        id: item.id,
        type: item.type,
        group,
    } as IconItem;
};
export type OPTS_FIGMA_ICONS = {
    prefix?: string;
    term?: string;
};

export const isMatchingIcon = (name: string, opts: OPTS_FIGMA_ICONS = {}) => {
    const hasOptions = Object.keys(opts).length > 0;
    const prefix = hasOptions ? opts.prefix : 'ICON-';
    const term = hasOptions ? opts.term : undefined;
    if (prefix && name.indexOf(prefix) === 0) {
        return true;
    } else if (term && name.indexOf(term) !== -1) {
        return true;
    }
    return false;
};

export const getIconItems = (json: JsonObject, opts: OPTS_FIGMA_ICONS = {}) => {
    let allIcons: IconItem[] = [];
    const pages = json.document.children;
    const sections = pages[1].children;
    for (const section of sections) {
        const sectionItems = section.children;
        if (sectionItems) {
            for (const item of sectionItems) {
            console.log(item.name, isMatchingIcon(item.name, opts) === true)
                if (isMatchingIcon(item.name, opts) === true) {
                    allIcons.push(getIconItem(item, section.name));
                } else if (item.children && item.children.length > 0) {
                    console.log(`Checking children of ${item.name} for icons... [${item.children.length} items]`);
                    const subItems = item.children;
                    for (const subItem of subItems) {
                        if (isMatchingIcon(subItem.name, opts) === true) {
                            allIcons.push(getIconItem(subItem, item.name));
                        }
                    }
                }
            }
        }
    }
    return allIcons;
};
