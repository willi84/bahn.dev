
import { SystemSettings } from './system.d';
import { isMicrosoft, isWSL, isLinuxPlatform, isMacPlatform, isWindowsPlatform } from './platform/platform';
import { hasBash, hasCode, hasPowershell } from './app/app';
import { getLinuxUser, getWindowsUser } from './user/user';
import { command, commandSafe, commandSafeFirst } from '../cmd/cmd';

const vscodeUserSettings = {
    mac: '~/Library/Application Support/Code/User/settings.json', // /$HOME/
    linux: '~/.config/Code/User/settings.json',
    wsl: '/mnt/c/Users/{windowsUser}/AppData/Roaming/Code/User/settings.json',
    windows: '/C:/Users/{windowsUser}/AppData/Roaming/Code/User/settings.json',
}

const vscodeWorkspaceSettings = '${REPO_ROOT}/.vscode/settings.json';

// C:\Users\Robert Willemelis\.vscode\extensions\icons


// // check if found
// const hasVscode = pathCode !== '';
// const settingsPathes = [
//     `${process.cwd()}/.vscode/settings.json`,
//     `~/.config/Code/User/settings.json`, // linux
//     '$HOME/.config/Code/User/settings.json', // linux
//     // mac
//     '/$HOME/Library/Application Support/Code/User/settings.json',
//     // '/Users/${os.userInfo().username}/Library/Application Support/Code/User/settings.json',
//     `~/.vscode/settings.json`, // linux
//     `/mnt/c/Users/${windowsUser}/AppData/Roaming/Code/User/settings.json`, // WSL
//     // /C:/Users/Robert Willemelis/AppData/Roaming/Code/User/settings.json// //ubuntu
//     `${process.cwd()}/.vscode/settings.local.json`,
//     `${process.cwd()}/.vscode/settings.workspace.json`,
//     `${process.cwd()}/.vscode/settings.workspace.local.json`,
// ];

// export const getLocalSettings = () => {
//     const result = [];
//     const rootFolder = command('echo ~').replace(/\r?\n|\r/g, '');
//     const projectRoot = command('git rev-parse --show-toplevel').replace(/\r?\n|\r/g, '');
//     const devFolderName = projectRoot.replace(rootFolder, '').replace(/^\//, '').split('/')[0];
//     const devFolder = path.join(rootFolder, devFolderName);
//     LOG.OK(`devt folder: ${devFolder}`);
//     // const localSettings = command(`find ${devFolder} -type d \( -name node_modules -o -name .git \) -prune -o -
// // path '*/.vscode/settings.json' -print`);
// const localSettings = command(`find "${devFolder}" -type d \\( -name node_modules -o -name .git \\) -prune -o -type f -path '*/.vscode/settings.json' -print`);

//     const settingsFiles = localSettings.split('\n').filter(file => file.trim() !== '');
//     for(const file of settingsFiles) {
//         try {

//             console.log('Checking settings file:', file);
//                 if(getSetting(file, 'material-icon-theme.folders.associations') || getSetting(file, 'material-icon-theme.files.associations')) {
//                     LOG.OK(`Settings file found: ${file}`);
//                     result.push(file);
//                 } else {
//                     LOG.WARN(`Settings file does not contain the expected associations: ${file}`);
//                 }
//         } catch(e){
//             LOG.FAIL(`Error processing settings file: ${file}`, e);
//         }
//     }
//     // console.log('Local settings files found:', settingsFiles);
//     // const rootFolder = command('git rev-parse --show-toplevel').replace(/\r?\n|\r/g, '');
//     // const settingsFile = path.join(rootFolder, 'settings.json');
//     return result;
// }
// export const getSettingsPath = (): string[] => {
//     const results = [];
//     for (const path of settingsPathes) {
//         const cmd = `test -f "${path}" && echo "valid" || echo "not found"`;
//         // console.log(cmd);
//         const checkExists = command(`test -f "${path}" && echo "valid" || echo "not found"`);
//         if (checkExists.trim() === 'valid') {
//             LOG.OK(`Settings file found: ${path}`);
//             results.push(path);
//         }
//     }
//     // LOG.WARN('No settings file found in the default locations.');
//     return results;
// };
export const getHome = (): string => {
    const home = commandSafeFirst('echo $HOME');
    if(home !== '$HOME'){
        return home;
    } else {
        // CMD
        const homeCMD = commandSafeFirst('echo %USERPROFILE%')
        if (homeCMD !== '%USERPROFILE%') {
            return homeCMD;
        }
    }
    return '$HOME'; // container or home not set
}
export const getWindowsHome = () => {
    return 'true';
}
export const getSystemSettings = (): SystemSettings => {
    const settings: SystemSettings = {
        isMicrosoft: isMicrosoft(),
        isMac: isMacPlatform(),
        isLinux: isLinuxPlatform(),
        isWindows: isWindowsPlatform(),
        cwd: process.cwd(),
        isWsl: isWSL(),
        hasPowershell: hasPowershell(),
        hasBash: hasBash(),
        hasCode: hasCode(),
        windowsUser: getWindowsUser(),
        linuxUser: getLinuxUser(),
        noEmoji: isMicrosoft() && isLinuxPlatform() && !hasCode(),
        home: getHome(),
    }
    return settings;
}

//export const systemSettings = {
//     hasVscode: hasVscode,
//     vscodeInstallationFolder: vscodeInstallation,
//     noEmojis: noEmojis,
// };
// export const getSetting = (path: string, key: string): any => {
//     const hasFile = FS.exists(path);
//     if (!hasFile) {
//         LOG.WARN(`Settings file does not exist: ${path}`);
//         return null;
//     } else {
//         const json: any = FS.readFile(path, {});
//         console.log(json[key])
//         LOG.OK(`Settings file found: ${path}`);
//         return json[key] || null;
//     }
// };
// // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color


