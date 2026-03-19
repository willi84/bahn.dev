const debug = false;
// const showOutput = debug ? '-v' : '-s';
export const showOutput = (debug: boolean): string => {
    return debug ? '-v' : '-s';
};

const FIGMA_API = 'https://api.figma.com/v1';
// establish connection within 5 seconds and timeout after 10 seconds to avoid errors
const CURL_AUTH = `curl ${showOutput(debug)} -H "X-Figma-Token: {TOKEN}"  --connect-timeout 20 --max-time 20`;

// ?depth=2

// endpoints
export const FIGMA_FILES = `${FIGMA_API}/files`;
export const FIGMA_IMAGES = `${FIGMA_API}/images`;
export const EP_FIGMA_FILE_API = `${FIGMA_FILES}/{FILE_KEY}`;
export const EP_FIGMA_IMAGE_API = `${FIGMA_IMAGES}/{FILE_KEY}?ids={IDS}&format=svg&svg_include_id=true`;
export const EP_FIGMA_API_FILE_VERSION = `${EP_FIGMA_FILE_API}/versions`;

export const FIGMA_FILE_VERSION = `${CURL_AUTH} "${EP_FIGMA_API_FILE_VERSION}"`;
export const FIGMA_FILE = `${CURL_AUTH} "${EP_FIGMA_FILE_API}"`;
export const FIGMA_GET_IMAGES = `${CURL_AUTH} "${EP_FIGMA_IMAGE_API}"`;

// https://api.figma.com/v1/images/${file}?ids=${ids}&format=svg

export const FIGMA_ERROR_GET_VERSIONS = 'No remote and local version found.';
export const FIGMA_ERROR_INVALID_RESPONSE = 'Invalid response from Figma API.';
