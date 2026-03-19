import { getHome, getSystemSettings } from './system';
import { mockPlatform, resetPlatform } from '../test_lib/utils/mock/mock';
import { SystemSettings } from './system.d';




describe('system', () => {
    describe('getHome()', () => {
        it('should return home on linux', () => {
            mockPlatform('linux');
            expect(getHome()).toEqual('/home/testuser');
        });
        it('should return home on wsl', () => {
            mockPlatform('linux', {isWSL: true});
            expect(getHome()).toEqual('/home/testuser');
        });
        it('should return home on darwin', () => {
            mockPlatform('darwin');
            expect(getHome()).toEqual('/Users/testuser');
        });
        it('should return home on windows with PS', () => {
            mockPlatform('win32', { isPowershell: true});
            expect(getHome()).toEqual('C:\\Users\\Test User');
        });
        it('should return home on windows on git bash', () => {
            mockPlatform('win32', {isBash: true});
            expect(getHome()).toEqual('/c/Users/Test User');
        });
        it('should return home on windows', () => {
            mockPlatform('win32', { isCMD: true});
            expect(getHome()).toEqual('C:\\Users\\Test User');
        });
        it('should return nothing when home is not set', () => {
            mockPlatform('freebsd', { noEnv: 'HOME' });
            expect(getHome()).toEqual('/home/testuser');
        });
    });
    describe('getSystemSettings()', () => {
        it('should return the system settings for linux platform', () => {
            const mocked = mockPlatform('linux');
            const result: SystemSettings = getSystemSettings();
            expect(result).toEqual({
                cwd: process.cwd(),
                isMicrosoft: false,
                isMac: false,
                isLinux: true,
                isWindows: false,
                isWsl: false,
                hasPowershell: false,
                hasBash: true,
                hasCode: true,
                windowsUser: undefined,
                linuxUser: 'testuser',
                noEmoji: false,
                home: '/home/testuser',
            });
            resetPlatform(mocked);
        });
        it('should return the system settings for windows platform', () => {
            const mocked = mockPlatform('win32', { isPowershell: true });
            const result: SystemSettings = getSystemSettings();
            expect(result).toEqual({
                cwd: process.cwd(),
                isMicrosoft: false,
                isMac: false,
                isLinux: false,
                isWindows: true,
                isWsl: false,
                hasPowershell: true,
                hasBash: false,
                hasCode: true,
                windowsUser: 'Test User',
                linuxUser: undefined,
                noEmoji: false,
                home: 'C:\\Users\\Test User',
            });
            resetPlatform(mocked);
        });
        it('should return the system settings for windows platform', () => {
            const mocked = mockPlatform('win32', {});
            const result: SystemSettings = getSystemSettings();
            expect(result).toStrictEqual({
                cwd: process.cwd(),
                isMicrosoft: false,
                isMac: false,
                isLinux: false,
                isWindows: true,
                isWsl: false,
                hasPowershell: true,
                hasBash: false,
                hasCode: true,
                windowsUser: 'Test User',
                // windowsUser: 'my-laptop\\Test User',
                linuxUser: undefined,
                noEmoji: false,
                home: 'C:\\Users\\Test User',
            });
            resetPlatform(mocked);
        });
        it('should return the system settings for mac platform', () => {
            const mocked = mockPlatform('darwin');
            const result: SystemSettings = getSystemSettings();

            // TODO: überall toStrictEqual verwenden
            expect(result).toStrictEqual({
                cwd: process.cwd(),
                isMicrosoft: false,
                isMac: true,
                isLinux: false,
                isWindows: false,
                isWsl: false,
                hasPowershell: false,
                hasBash: true,
                hasCode: true,
                windowsUser: undefined,
                linuxUser: 'testuser',
                noEmoji: false,
                home: '/Users/testuser',
            });
            resetPlatform(mocked);
        });
        it('should return the system settings for wsl plattform', () => {
            const mocked = mockPlatform('linux', { isWSL: true });
            const result: SystemSettings = getSystemSettings();
            expect(result).toStrictEqual({
                cwd: process.cwd(),
                isMicrosoft: true,
                isWindows: false,
                isWsl: true,
                isMac: false,
                isLinux: true,
                hasPowershell: true,
                hasBash: true,
                hasCode: true,
                windowsUser: 'Test User',
                linuxUser: 'testuser',
                noEmoji: false,
                home: '/home/testuser',
            });
            resetPlatform(mocked);
        });
    });
});

