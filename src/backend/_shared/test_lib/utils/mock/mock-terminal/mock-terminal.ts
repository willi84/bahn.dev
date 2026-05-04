import { TERMINAL } from '../../../../../index.d';
import { WIN } from '../../../../system/platform/platform.config';
import { PLATFORM_CODE } from '../../../../system/platform/platform.d';
import { getFlagValue } from '../../../../tools/tools';
import { MOCK_OPTS, MOCK_TERMINALS, TERMINAL_FLAG } from '../mock.d';

export const getTerminalFlag = (value: TERMINAL_FLAG, current: boolean): boolean => {
    return getFlagValue(value, current);
}
export const mockTerminals = (opts: MOCK_OPTS, platform: PLATFORM_CODE) => {
    // copy opts orig
    // const opts = JSON.parse(JSON.stringify(optsOrig));
    let result: MOCK_TERMINALS = {cmd: false, ps: false, bash: false}
    if(platform === WIN){
        result = {cmd: true, ps: true, bash: false}
    } else {
        result =  {cmd: false, ps: false, bash: true}
        if(opts.isWSL){
            result['ps'] = true; // WSL has bash
        }
    }
    if(opts.terminals){
        const terminals = Object.keys(opts.terminals);
        for(const terminal of terminals){
            const key = terminal as keyof MOCK_TERMINALS;
            result[key] = opts.terminals[key];
        }
    }
    result['bash'] = getTerminalFlag(opts.isBash, result['bash']);
    result['cmd'] = getTerminalFlag(opts.isCMD, result['cmd']);
    result['ps'] = getTerminalFlag(opts.isPowershell, result['ps']);
    return result;
}
export const hasTerminal = (app: string, opts: MOCK_OPTS): boolean => {
    let result: boolean = false;
    let appID = app.toLowerCase().replace('.exe', '');
    appID = appID === 'powershell' ? 'ps' : appID; // powershell is ps in terminals
    const key = appID as keyof MOCK_TERMINALS;
    if(opts.terminals){
        if(opts.terminals[key] !== undefined){
            result = opts.terminals[key];
        }
    } else {
        switch(appID){
            case 'ps':
                result = getFlagValue(opts.isPowershell, result);
                break;
            case 'bash':
                result = getFlagValue(opts.isBash, result);
                break;
            case 'cmd':
                result = getFlagValue(opts.isCMD, result);
                break;
            default:
                result = false;
        }
    }
    return result;
};
export const getActiveTerminals = (opts: MOCK_OPTS): TERMINAL[] => {
    const result: TERMINAL[] = [];
    if(opts.isBash || opts.terminals?.bash === true){
        result.push('bash');
    }
    if(opts.isCMD || opts.terminals?.cmd === true){
        result.push('cmd');
    }
    if(opts.isPowershell || opts.terminals?.ps === true){
        result.push('ps');
    }
    return result;
}
