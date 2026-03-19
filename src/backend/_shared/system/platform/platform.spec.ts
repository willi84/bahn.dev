import { mockPlatform, resetPlatform } from '../../test_lib/utils/mock/mock';
import { getPlatform, isLinuxPlatform, isMacPlatform, isMicrosoft, isUnixLikePlattform, isWindowsPlatform, isWSL } from './platform';

describe('system/platform', () => {
    let mocked: any;
    afterEach(() => {
        resetPlatform(mocked);
    });
    describe('✅ getPlatform()', () => {
        it('should return "mac" for darwin platform', () => {
            mocked = mockPlatform('darwin');
            expect(getPlatform()).toEqual('mac');
        });
        it('should return "windows" for win32 platform', () => {
            mocked = mockPlatform('win32');
            expect(getPlatform()).toEqual('windows');
        });
        it('should return "linux" for linux platform', () => {
            mocked = mockPlatform('linux');
            expect(getPlatform()).toEqual('linux');
        });
        it('should return "other" for unknown platform', () => {
            mocked = mockPlatform('freebsd');
            expect(getPlatform()).toEqual('other');
        });
    });
    describe('✅ isLinuxPlatform()', () => {
        const fn = isLinuxPlatform;
        it('should return true for Linux platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(true);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(false);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(false);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('freebsd');
            expect(fn()).toEqual(false);
        });
    });
    describe('✅ isMacPlatform()', () => {
        const fn = isMacPlatform;
        it('should return true for Linux platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(false);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(false);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(true);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('freebsd');
            expect(fn()).toEqual(false);
        });
    });
    describe('✅ isWindowsPlatform()', () => {
        const fn = isWindowsPlatform;
        it('should return true for Linux platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(false);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(true);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(false);
        });
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('freebsd');
            expect(fn()).toEqual(false);
        });
    });
    describe('✅ isMicrosoft()', () => {
        const fn = isMicrosoft;
        it('should return false if not windows', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(false);
        });
        it('should return true for Microsoft wsl platforms', () => {
            mocked = mockPlatform('linux', { isWSL: true });
            expect(fn()).toEqual(true);
        });
        it('should return false if not windows', () => {
            mocked = mockPlatform('darwin');
            expect(isMicrosoft()).toEqual(false);
        });
    });
    describe('✅ isWSL()', () => {
        const fn = isWSL;
        it('should return true for WSL platforms', () => {
            mocked = mockPlatform('linux', { isWSL: true });
            expect(fn()).toEqual(true);
        });
        it('should return false for non-WSL platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(false);
        });
        it('should return false for Windows platforms', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(false);
        });
        it('should return false for Mac platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(false);
        });
    });
    describe('✅ isUnixLikePlattform()', () => {
        const fn = isUnixLikePlattform;
        it('should return true for WSL platforms', () => {
            mocked = mockPlatform('linux', { isWSL: true });
            expect(fn()).toEqual(true);
        });
        it('should return true for WSL platforms', () => {
            mocked = mockPlatform('linux', { isWSL: false });
            expect(fn()).toEqual(true);
        });
        it('should return false for non-WSL platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(true);
        });
        it('should return false for Windows platforms', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(false);
        });
        it('should return true for Mac platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(true);
        });
    })
})
