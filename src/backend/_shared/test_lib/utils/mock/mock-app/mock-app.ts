import * as cmd from '../../../../cmd/cmd';
import { LOG } from '../../../../log/log';
import { LIN, WIN, MAC } from '../../../../system/platform/platform.config';
import { PLATFORM_CODE } from '../../../../system/platform/platform.d';
import { MOCK_OPTS } from '../mock.d';
import { hasTerminal, mockTerminals } from '../mock-terminal/mock-terminal';
import { MOCKED_APP_PATHES } from './config/mock_app.config';

export const getMockedAppPath = (app: string, platform: PLATFORM_CODE, optsOrig: MOCK_OPTS = {}): string => {
    // const opts = optsOrig; // deep copy opts
    const opts = JSON.parse(JSON.stringify(optsOrig)); // avoid overwriting by deep copy opts
    const isWin = (platform === WIN);
    // const isPowershell = opts && opts.isPowershell || false;
    const isWSL = opts && opts.isWSL || false;

    // TODO: auslagern und testen
    if(!opts.terminals){
        const oldOpts = {...opts};
        opts.terminals = mockTerminals(opts, platform);
        if(Object.keys(oldOpts).length === 0){
        }
    }
    const isBash = hasTerminal('bash', opts);
    // const isBash = opts && opts.isBash !== undefined ? opts.isBash : false;
    const isPowershell = hasTerminal('powershell.exe', opts);
    // no run
    if (app === 'powershell.exe') {
        if(!isPowershell) {
            LOG.WARN(`[MOCK] No powershell terminal found for ${app}`);
            return '';
        } else if(!isWin && !(isBash || isPowershell)) {
            LOG.WARN(`[MOCK] No bash terminal found for ${app}`);
            return '';
        }
    } else if (app === 'bash') {
        if (!isBash && isWin) {
            LOG.WARN(`[MOCK] No bash terminal found for ${app}`);
            return '';
        }
    }
    if(app === 'powershell.exe' && !isPowershell){
        LOG.WARN(`[MOCK] No powershell terminal found for ${app}`);
        return '';
    }
    // const noRun = (app === 'powershell.exe' && (!isPowershell)) || (app === 'bash' && isBash === false && isWin);
    // if(noRun) {
    //     return '';
    // }
    if(MOCKED_APP_PATHES[app]){
        let finalePathes = '';
        const TARGETS = MOCKED_APP_PATHES[app].path
        // return code
        if (platform === LIN) {
            const linuxPaths = TARGETS.linux;
            finalePathes = isWSL ? linuxPaths.wsl : linuxPaths.unix;
        } else if (platform === MAC) {
            const darwinPaths = TARGETS.darwin;
            finalePathes = darwinPaths.unix;
        } else if (platform === WIN) {
            const winPaths = TARGETS.win32;
            finalePathes = isBash ? winPaths.unix : winPaths.dos;
        }
        // split by new line and take the first path
        const finalPath = finalePathes.split(/\r?\n|\r/)[0].trim();
        return finalPath;
    } else if (app === '') {
        LOG.WARN(`[MOCK] No app found for ${app}`);
    }
    return '';
}


export const getMockedApp = (input: string, platform: PLATFORM_CODE, opts: MOCK_OPTS) => {
    const gcApp = input.match(/\(get-command\s*[^\)]+\)\.(?:path|source)/i);
    const argument = cmd.getAppNameCmd(input, platform, opts);
    const command = cmd.getCommandName(input);
    const isWin = (platform === WIN);
    const isMac = (platform === MAC);
    const isPowershell = hasTerminal('powershell', opts);
    const isBash = hasTerminal('bash', opts);
    if(gcApp && isWin) {
        return isPowershell ? getMockedAppPath(argument, platform, opts) : '';
    }
    switch(command){
        case 'command':
            if(platform === MAC || platform === LIN){
                return getMockedAppPath(argument, platform, opts)
            }
            break;
        case 'where':
            if(isWin){
                if(isBash){
                    return getMockedAppPath(argument, platform, opts);
                } else if(isPowershell) {
                    return '';
                }
                // if ((isWin && (!isBash) ) && !opts.notInPath ) {
                if ((!isBash ) && !opts.notInPath ) {
                    return getMockedAppPath(argument, platform, opts);
                }
            }
            if(isMac){
                return 'jsh: command not found: where\n'
            }
            break;
        case 'which':
            if (isWin && (isBash === true) ) {
                return getMockedAppPath(argument, platform, opts);
            }
            break;
    }
    return '';
}
