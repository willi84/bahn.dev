export type IconNode = {
    name: string;
    id: string;
    type: string;
    group: string;
};
export type IconItem = {
    name: string;
    filename: string;
    id: string;
    type: string;
    group: string;
    url: string;
};
export type FIGMA_CONFIG = {
    FILE_KEY: string;
    TOKEN: string;
};
export type DOWNLOAD_ITEM = {
    id: string;
    name: string;
    filename: string;
    type: string;
    group: string;
    url: string;
    localPath?: string;
    httpStatus?: string;
};
