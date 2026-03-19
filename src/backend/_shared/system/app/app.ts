import { TERMINAL } from '../../../index.d';
import { commandSafeFirst } from '../../cmd/cmd';
import { LOG } from '../../log/log';
import { isLinuxPlatform, isMacPlatform, isWindowsPlatform } from '../platform/platform';

export const getAppPath = (app: string): string|undefined => {
    if( app.trim() === '' ){
        return undefined;
    }
    if(isLinuxPlatform() || isMacPlatform()) {
        // command -v auch bei alias
        const result = commandSafeFirst(`command -v ${app}`); // Linux
        if(result !== '') {
            return result;
        } else {
            LOG.WARN(`${app} not found in PATH [Linux]`);
            // return '';
        }
    } else if (isWindowsPlatform()) {
        const result =  commandSafeFirst(`where ${app}`); // CMD
        if(result !== '') {
            return result;
        } else {
            const alternative =  commandSafeFirst(`(Get-Command ${app}).Source`); // PowerShell
            if(alternative !== '') {
                return alternative;
            } else {
                LOG.WARN(`${app} not found in PATH [Win]`);
                // return '';
            }
        }
    }
}
export const getVSCodePath = () => { return getAppPath('code'); }
export const hasApp = (app: string): boolean => {
    const result = getAppPath(app);
    if(result && result !== '') {
            return true;
    } else {
        return false;
    }
};

export const hasPowershell = () => { return hasApp('powershell.exe'); };
export const hasBash = () => { return hasApp('bash'); };
export const hasCode = () => { return hasApp('code'); };

export const detectShell = (): TERMINAL => {
    const isWindows = isWindowsPlatform();
    const input = 'echo $SHELL';
    const result = commandSafeFirst(input);
    if (isWindows) {
        if (result === '') {
            // direct on ps
            return 'ps';
        } else if (result === '$SHELL') {
            return 'cmd';
        } else {
            return 'bash';
        }
    } else {
        return result === '' ? 'bash' : result.indexOf('bash') !== -1 ? 'bash' : 'other';
    }
}