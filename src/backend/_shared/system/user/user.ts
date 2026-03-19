import { commandSafeFirst } from '../../cmd/cmd';
import { hasPowershell } from '../app/app';
import { isLinuxPlatform, isMacPlatform, isMicrosoft, isWindowsPlatform, isWSL } from '../platform/platform';

export const getWindowsUser = () => {
    const hasPowershll = hasPowershell();
    const isWindows = isWindowsPlatform();
    const isWsl = isMicrosoft() && isLinuxPlatform();

    if(isWindows){
        if( hasPowershll ) {
            const user = commandSafeFirst(
                'powershell.exe "[System.Environment]::UserName"'
            );
            return user;  // return simple
        } else {
            const user = commandSafeFirst('echo %USERNAME%');
            if(user !== '%USERNAME%'){
                return user;
            } else {
                // fallback for cmd
                const user = commandSafeFirst('whoami');
                return user;
            }
        }
    } else if( isWsl ) {
        if (hasPowershll) {
            const user = commandSafeFirst(
                'powershell.exe "[System.Environment]::UserName"'
            );
            return user;
        }
    }

    return undefined;
};
export const getLinuxUser = () => {
    if (isLinuxPlatform() || isMacPlatform() || isWSL()) {
        const user = commandSafeFirst('whoami');
        return user;
    }
    return undefined;
};
