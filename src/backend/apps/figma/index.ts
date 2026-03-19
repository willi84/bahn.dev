import { JsonObject } from '../..';
import { FIGMA_CONFIG } from '../../_shared/figma/figma.d';
import {
    downloadIcons,
    generateIcons,
    getFileContent,
    getIconItems,
} from '../../_shared/figma/figma';
import { LOG } from '../../_shared/log/log';
import { getEnv } from '../../_shared/system/env/env';

const envVariables = ['FIGMA_ATOMIC_PAT', 'FIGMA_ATOMIC_FILE'];

const FILE_KEY = 'bWT0sgPDjlvAqey1pT1bIl';

// const PREFIX = '🧭 Side';
const PREFIX = 'MAP-';

const env = getEnv(envVariables);
const CONFIG: FIGMA_CONFIG = {
    // FILE_KEY: env.FIGMA_ATOMIC_FILE,
    FILE_KEY: FILE_KEY || env.FIGMA_ATOMIC_FILE,
    TOKEN: env.FIGMA_ATOMIC_PAT,
};
// console.log(CONFIG)

// get figma file from cache or api
const json: JsonObject = getFileContent(CONFIG);
if (json && json.document) {
    // Figma file content is available
    LOG.OK('Figma file content retrieved successfully.');
    const iconNodesTest = getIconItems(json, { prefix: PREFIX });
    // const result = generateIcons(CONFIG, iconNodesTest, 'ICON-');
    const result = generateIcons(CONFIG, iconNodesTest, PREFIX);
    // console.log(result);
    downloadIcons(result, 'src/frontend/assets/hackathon');
}