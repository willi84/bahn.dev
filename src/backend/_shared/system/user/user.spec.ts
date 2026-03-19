import { mockPlatform, resetPlatform } from '../../test_lib/utils/mock/mock';
import { getLinuxUser, getWindowsUser } from './user';

describe('system/user', () => {
    let mocked: any;
    afterEach(() => {
        resetPlatform(mocked);
    });
    describe('getWindowsUser()', () => {
        const fn = getWindowsUser;
        it('should return the windows user', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual('Test User');
            // expect(user).toEqual('my-laptop\\Test User');
        });
        it('should return the windows user', () => {
            mocked = mockPlatform('win32', { isPowershell: true });
            expect(fn()).toEqual('Test User');
        });
        it('should return the windows user', () => {
            mocked = mockPlatform('win32', { isPowershell: false });
            expect(fn()).toEqual('Test User');
        });
        it('should return the windows user', () => {
            mocked = mockPlatform('win32', { isCMD: true, isPowershell: false });
            expect(fn()).toEqual('Test User');
        });
        it('should return undefined if powershell is not available', () => {
            mocked = mockPlatform('linux', { isWSL: true });
            expect(fn()).toEqual('Test User');
        });
        it('should return undefined if powershell is not available', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toBeUndefined();
        });
    });
    describe('getLinuxUser()', () => {
        const fn = getLinuxUser;
        it('should return the linux user', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual('testuser');
        });
        it('should return undefined if not linux platform', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(undefined);
        });
    });
});