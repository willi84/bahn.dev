import * as os from 'os';
import { MAC, WIN, LIN, OTHER, MACOS, WINDOWS, LINUX } from './platform.config';
import { PLATFORM_CODE, PLATFORM_ID } from './platform.d';
export const getPlatform = (): PLATFORM_ID => {
    const platform: PLATFORM_CODE = process.platform;
    let result: PLATFORM_ID = OTHER;
    switch (platform) {
        case MAC:
            result = MACOS;
            break;
        case WIN:
            result = WINDOWS;
            break;
        case LIN:
            result = LINUX;
            break;
        default:
            return OTHER;
    }
    return result;
};
export const isLinuxPlatform = () => { return getPlatform() === LINUX; };
export const isMacPlatform = () => { return getPlatform() === MACOS; };
export const isWindowsPlatform = () => { return getPlatform() === WINDOWS; };

export const isMicrosoft = () => {
    return os.release().toLocaleLowerCase().includes('microsoft');
};
export const isWSL = () => {
    return isLinuxPlatform() && isMicrosoft();
}
export const isUnixLikePlattform = () => {
    return (isLinuxPlatform() || isMacPlatform() || isWSL()) && !isWindowsPlatform();
}
