import { mockPlatform, resetPlatform } from '../../test_lib/utils/mock/mock';
import {
    IS_BASH,
    NO_CMD,
    NO_OPTS,
    NO_PS,
    NO_TERMINALS,
    T_BASH,
    T_NO_TERMINALS,
} from '../../test_lib/utils/mock/mock.config';
import { MOCKED_APP_PATHES } from '../../test_lib/utils/mock/mock_app/config/mock_app.config';
import { PLATFORM_CODE } from '../platform/platform.d';
import { LIN, MAC, WIN } from '../platform/platform.config';
import {
    getVSCodePath,
    getAppPath,
    hasApp,
    hasPowershell,
    hasBash,
    hasCode,
    detectShell,
} from './app';

describe('system/app', () => {
    let mocked: any;
    afterEach(() => {
        resetPlatform(mocked);
    });
    describe('✅ getAppPath()', () => {
        const fn = getAppPath;
        describe('get app ppath of code', () => {
            describe('LINUX', () => {
                const OS: PLATFORM_CODE = LIN;
                it('should return the path for code on linux', () => {
                    mocked = mockPlatform(OS);
                    expect(fn('code')).toEqual('/usr/bin/code');
                });
                it('should return undefined for unknown software', () => {
                    mocked = mockPlatform(OS);
                    expect(fn('unknown')).toBeUndefined();
                });
            });
            describe('WINDOWS', () => {
                const OS: PLATFORM_CODE = WIN;
                describe('known apps', () => {
                    const APP = 'code';
                    it('should return the path for code on windows', () => {
                        mocked = mockPlatform(OS);
                        expect(fn(APP)).toEqual('C:\\Program Files\\Microsoft VS Code\\bin\\code');
                    });
                    it('should return the path for code on windows if not in path found [where]', () => {
                        mocked = mockPlatform(OS, { notInPath: true });
                        expect(fn(APP)).toEqual('C:\\Program Files\\Microsoft VS Code\\bin\\code');
                    });
                    it('should return the path for code on mac', () => {
                        mocked = mockPlatform(MAC);
                        expect(fn(APP)).toEqual('/usr/local/bin/code');
                    });
                });
                describe('unknown apps', () => {
                    const APP = 'unknown';
                    it('should not return the path for unknwon on windows', () => {
                        mocked = mockPlatform(OS);
                        expect(fn(APP)).toEqual(undefined);
                    });
                    it('should not return the path for unknown on windows without PS', () => {
                        mocked = mockPlatform(OS, NO_PS);
                        expect(fn(APP)).toEqual(undefined);
                    });
                    it('should not return the path for unknown on windows without PS', () => {
                        mocked = mockPlatform(OS, NO_CMD);
                        expect(fn(APP)).toEqual(undefined);
                    });
                    it('should not return the path for unknown on windows without PS', () => {
                        mocked = mockPlatform(OS, T_NO_TERMINALS);
                        expect(fn(APP)).toEqual(undefined);
                    });
                    it('should not return the path for unknown on windows without PS', () => {
                        mocked = mockPlatform(OS, { ...NO_PS, ...NO_CMD });
                        expect(fn(' ')).toEqual(undefined);
                    });
                    it('should not return the path for unknown on windows without PS but bash', () => {
                        mocked = mockPlatform(OS, { ...NO_PS, ...IS_BASH });
                        expect(fn(APP)).toEqual(undefined);
                    });
                });
            });
        });
    });
    describe('✅ getVSCodePath()', () => {
        const fn = getVSCodePath;
        it('should return the vscode path for linux platform', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(MOCKED_APP_PATHES.code.path.linux.unix);
        });
        it('should return the vscode path for windows platform', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(
                'C:\\Program Files\\Microsoft VS Code\\bin\\code'
            );
        });
        it('should return the vscode path for mac platform', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(MOCKED_APP_PATHES.code.path.darwin.unix);
        });
    });
    describe('✅ hasApp()', () => {
        const fn = hasApp;
        const OS: PLATFORM_CODE = LIN;
        it('should return true for existing app', () => {
            mocked = mockPlatform(OS);
            expect(fn('code')).toEqual(true);
        });
        it('should return false for non-existing app', () => {
            mocked = mockPlatform(OS);
            expect(fn('Xcode')).toEqual(false);
        });
    });
    describe('✅ hasPowershell()', () => {
        const fn = hasPowershell;
        describe('valid', () => {
            it('should return true for Windows platforms & isPowershell', () => {
                mocked = mockPlatform('win32', { isPowershell: true });
                expect(fn()).toEqual(true);
            });
            it('should return true for Windows platforms & has Powershell', () => {
                mocked = mockPlatform('win32', {
                    isPowershell: true,
                    notInPath: true,
                });
                expect(fn()).toEqual(true);
            });
            it('should return true for Windows platforms & has CMD', () => {
                mocked = mockPlatform('win32', {
                    isCMD: true,
                    isPowershell: true,
                });
                expect(fn()).toEqual(true);
            });
            it('should return true for Windows platforms wsl', () => {
                mocked = mockPlatform('linux', {
                    isWSL: true,
                    isPowershell: true,
                });
                expect(fn()).toEqual(true);
            });
        });
        describe('invalid', () => {
            it('should return false for Windows platforms without Powershell', () => {
                mocked = mockPlatform('win32', { isPowershell: false });
                expect(fn()).toEqual(false);
            });
            it('should return false for Mac platforms', () => {
                mocked = mockPlatform('darwin');
                expect(fn()).toEqual(false);
            });
            it('should return false for Linux platforms', () => {
                mocked = mockPlatform('linux');
                expect(fn()).toEqual(false);
            });
        });
    });
    describe('✅ hasBash()', () => {
        const fn = hasBash;
        describe('valid', () => {
            it('should return true for Mac platforms', () => {
                mocked = mockPlatform('darwin');
                expect(fn()).toEqual(true);
            });
            it('should return true for Linux platforms', () => {
                mocked = mockPlatform('linux');
                expect(fn()).toEqual(true);
            });
            it('should return true for Windows platforms wsl', () => {
                mocked = mockPlatform('linux', {
                    isWSL: true,
                    isPowershell: true,
                });
                expect(fn()).toEqual(true);
            });
        });
        describe('invalid', () => {
            it('should return false for Windows platforms without Powershell', () => {
                mocked = mockPlatform('win32', { isPowershell: false });
                expect(fn()).toEqual(false);
            });
            it('should return false for Windows platforms & isPowershell', () => {
                mocked = mockPlatform('win32', { isPowershell: true });
                expect(fn()).toEqual(false);
            });
            it('should return false for Windows platforms & has Powershell', () => {
                mocked = mockPlatform('win32', {
                    isPowershell: true,
                    notInPath: true,
                });
                expect(fn()).toEqual(false);
            });
            it('should return false for Windows platforms & has CMD', () => {
                mocked = mockPlatform('win32', {
                    isCMD: true,
                    isPowershell: true,
                });
                expect(fn()).toEqual(false);
            });
        });
    });
    describe('✅ hasCode()', () => {
        const fn = hasCode;
        it('should return true for Windows platforms', () => {
            mocked = mockPlatform('win32');
            expect(fn()).toEqual(true);
        });
        it('should return true for Mac platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual(true);
        });
        it('should return true for Linux platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual(true);
        });
        it('should return false for unknown platforms', () => {
            mocked = mockPlatform('freebsd');
            expect(fn()).toEqual(false);
        });
    });
    describe('✅ detectShell()', () => {
        const fn = detectShell;
        describe('WIN', () => {
            const OS = 'win32';
            it('should return powershell for Windows platforms', () => {
                mocked = mockPlatform(OS, NO_CMD);
                expect(fn()).toEqual('ps');
            });
            it('should return cmd for Windows platforms', () => {
                mocked = mockPlatform(OS, NO_PS);
                expect(fn()).toEqual('cmd');
            });
            it('should return the input for others shells on Windows platforms', () => {
                mocked = mockPlatform(OS, { ...IS_BASH, ...NO_PS, ...NO_CMD });
                expect(fn()).toEqual('bash');
            });
            it('should return the input for others shells on Windows platforms', () => {
                mocked = mockPlatform(OS, T_BASH);
                expect(fn()).toEqual('bash');
            });
            it('should return default shell on Windows platforms', () => {
                mocked = mockPlatform(OS, NO_OPTS);
                expect(fn()).toEqual('cmd');
            });
        });
        it('should return bash for Linux platforms', () => {
            mocked = mockPlatform('linux');
            expect(fn()).toEqual('bash');
        });
        it('should return bash for unknown shell', () => {
            mocked = mockPlatform('lorem', { isEmpty: true, debug: true });
            console.log(mocked)
            expect(fn()).toEqual('other');
        });
        it('should return bash for Mac platforms', () => {
            mocked = mockPlatform('darwin');
            expect(fn()).toEqual('bash');
        });
    });
});
