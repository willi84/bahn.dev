import { getFlagValue } from '../../../../tools/tools';
import { MOCK_OPTS, VALUE_OPTIONS } from '../mock.d';
import { PLATFORM_CODE } from '../../../../system/platform/platform.d';
import { LIN, MAC, WIN } from '../../../../system/platform/platform.config';

export const mockWinEnv = (key: string, value: string, platform: PLATFORM_CODE, opts: MOCK_OPTS) => {
    const defaultValue = `%${key}%\n`;
    if(opts.isWSL) return defaultValue;
    if (platform === 'win32') {
        if(opts.isPowershell || opts.isCMD) {
            return `${value}\n`;
        }
    }
    return defaultValue;
}

export const mockLinuxEnv = (key: string, value: VALUE_OPTIONS, platform: PLATFORM_CODE, opts: MOCK_OPTS) => {
    const defaultValue = `${key}`;
    let result = defaultValue;

    const isPowershell = getFlagValue(opts.isPowershell, getFlagValue(opts.terminals?.ps, false));
    const isWSL = getFlagValue(opts.isWSL, false);
    const isCMD = getFlagValue(opts.isCMD, getFlagValue(opts.terminals?.cmd, false));
    const isBash = getFlagValue(opts.isBash, getFlagValue(opts.terminals?.bash, false));
    if(opts.noEnv === key){
        result = defaultValue; // if not exists on linux its empty
    } else {
        switch(platform) {
            case LIN:
                result = value.linux || defaultValue;
                break;
            case MAC:
                result = value.darwin || defaultValue;
                break;
            case WIN:
                if (isPowershell) {
                    if(isCMD){
                        result = getFlagValue(value.windows?.cmd, defaultValue);
                    } else {
                        result = getFlagValue(value.windows?.ps, defaultValue);
                    }
                }
                else if (isCMD) {
                    result = getFlagValue(value.windows?.cmd, defaultValue);
                }
                else if (isBash) { // git bash.exe
                    result = getFlagValue(value.windows?.bash, defaultValue);
                }
                else {
                    result = defaultValue; // default for other platforms
                }
                if(opts.debug === true){
                    // console.log(`isPowershell: ${isPowershell}, isCMD: ${isCMD}, isBash: ${isBash}`)
                    // console.log(opts)
                    // console.log(result);
                    // console.log(defaultValue)
                }
                break;
            default:
                if(opts.isEmpty){
                    // console.log(opts)
                    // console.log(value)
                }
                result = value.default || defaultValue;
                break;
        }
    }
    return `${result}\n`
}
