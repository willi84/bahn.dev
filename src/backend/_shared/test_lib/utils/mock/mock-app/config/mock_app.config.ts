import { allPathTypes, PosixPath } from '../../../../../..';
import { MOCK_APP, PATH_BASE } from '../../mock.d';

// facotry to create a mock software object
export const createAppPath = (name: string, path: PATH_BASE, nonePath = ''): MOCK_APP => {
    const unixPathWin = path.windows.replace(/\\/g, '/')
        .replace(/([A-Z]):/g,(_, g1) => `/${g1.toLowerCase()}`) // convert to lower case and add leading slash;
        .split(/\r?\n|\r/)[0] // on unix just 1st result taken
    const wslPath = unixPathWin.replace(/\/([a-z])\//, '/mnt/$1/'); // convert to WSL path
    const dosPath = path.windows;
    return {
        name,
        path: {
            none: nonePath as allPathTypes, // for no path
            win32: {
                dos: dosPath, // keep dos path for win32
                unix: unixPathWin as PosixPath, // convert to unix path for win32
            },
            linux: {
                unix: path.linux,
                wsl: wslPath as PosixPath, // convert to WSL path
            },
            darwin: {
                unix: path.darwin,
            }
        }
    };
};


//
export const MOCKED_APP_PATHES: { [key: string]: MOCK_APP} = {
    code : createAppPath('code', {
        windows: 'C:\\Program Files\\Microsoft VS Code\\bin\\code\n\\C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd', // test double result
        linux: '/usr/bin/code',
        darwin: '/usr/local/bin/code',
    }),
    'powershell.exe': createAppPath('powershell', {
        windows: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
        linux: '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe',
        darwin: '/usr/local/bin/pwsh', // special on mac
    }),
    bash: createAppPath('bash', {
        windows: 'C:\\Windows\\System32\\bash.exe',
        linux: '/usr/bin/bash',
        darwin: '/usr/local/bin/bash',
    }),
};


export const EMPTY_PATH = '';
