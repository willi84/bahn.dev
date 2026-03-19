import { SystemSettings } from '../system.d';

export const getIconfolder = (system: SystemSettings): string => {
    if (system.isWsl && system.windowsUser) {
        return `${system.windowsHome}/.vscode/extensions/_icons`;
        // return `/mnt/c/Users/${system.windowsUser}/.vscode/extensions/_icons`;
    } else if (system.isWindows) {
        return `${system.home}\\.vscode\\extensions\\_icons`;
    } else if (system.isMac || system.isLinux) {
        return `${system.home}/.vscode/extensions/_icons`;
    }
    return '';
}
