// maybe later renaem to ide

import { SystemSettings } from '../system.d';
import { getIconfolder } from './editor';

describe('editor', () => {
     describe('getIconfolder()', () => {
        const fn = getIconfolder;
        it('should return the correct icon folder for WSL', () => {
            const system: SystemSettings = {
                isWsl: true,
                windowsUser: 'TestUser',
                isWindows: false,
                isMac: false,
                isLinux: false,
                isMicrosoft: true,
                cwd: '/home/testuser',
                hasPowershell: false,
                hasBash: true,
                hasCode: true,
                linuxUser: 'testuser',
                noEmoji: false,
                home: '/home/testuser',
            };
            const iconFolder = fn(system);
            const result = '/mnt/c/Users/TestUser/.vscode/extensions/_icons';
            expect(iconFolder).toEqual(result);
        });

        it('should return the correct icon folder for Windows', () => {
            const system = {
                isWsl: false,
                windowsUser: 'TestUser',
                isWindows: true,
                isMac: false,
                isLinux: false,
                isMicrosoft: false,
                home: 'C:\\Users\\TestUser',
                cwd: 'C:\\Users\\TestUser\\Documents',
                hasPowershell: true,
                hasBash: false,
                hasCode: true,
                linuxUser: undefined,
                noEmoji: false,

            };
            const iconFolder = fn(system);
            expect(iconFolder).toEqual('C:\\Users\\TestUser\\.vscode\\extensions\\_icons');
        });

        it('should return the correct icon folder for Mac', () => {
            const system = {
                isWsl: false,
                windowsUser: undefined,
                isWindows: false,
                isMac: true,
                isLinux: false,
                isMicrosoft: false,
                home: '/Users/TestUser',
                cwd: '/Users/TestUser/Documents',
                hasPowershell: false,
                hasBash: true,
                hasCode: true,
                linuxUser: undefined,
                noEmoji: false,
            };
            const iconFolder = fn(system);
            expect(iconFolder).toEqual('/Users/TestUser/.vscode/extensions/_icons');
        });

        it('should return the correct icon folder for Linux', () => {
            const system = {
                isWsl: false,
                windowsUser: undefined,
                isWindows: false,
                isMac: false,
                isLinux: true,
                isMicrosoft: false,
                home: '/home/testuser',
                cwd: '/home/testuser/Documents',
                hasPowershell: false,
                hasBash: true,
                hasCode: true,
                linuxUser: 'testuser',
                noEmoji: false,
            };
            const iconFolder = fn(system);
            // TODO: testsn
            expect(iconFolder).toEqual('/home/testuser/.vscode/extensions/_icons');
        });
    });
})
