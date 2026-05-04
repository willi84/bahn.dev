import { ERROR, TERMINALS } from '../../../../index.d';
import * as cmd from '../../../cmd/cmd';
import * as os from 'os';
import { LOG } from '../../../log/log';
import {
    MOCK_ERROR_NO_CURL,
    MOCK_ERROR_NO_TARGET,
    MOCK_ERROR_UNKNOWN,
    MOCK_ERROR_INVALID_URL,
    MOCKED_PLATFORMS,
} from './mock.config';
import { MOCK_OPTS, MOCK_RESULT, MOCK_SYSTEM, MOCK_TARGET, MOCK_TARGETS, VALUE_OPTIONS } from './mock.d';
import { isUnixLikePlattform } from '../../../system/platform/platform';
import { mockTerminals } from './mock-terminal/mock-terminal';
import { mockLinuxEnv, mockWinEnv } from './mock-env/mock-env';
import { getMockedApp } from './mock-app/mock-app';

export const createError = (message: string, input?: string): ERROR => {
    LOG.WARN(`[MOCK] ${message}${input ? `: ${input}` : ''}`);
    return {
        status: 400,
        err: `[MOCK] ${message}`,
    };
};

export const getMockResult = (targets: MOCK_TARGETS, url: string): string => {
    let causeError = false;
    const isCurl = url.startsWith('curl');
    let result: MOCK_RESULT = {};
    if (!isCurl) {
        result = createError(MOCK_ERROR_NO_CURL, url);
    } else {
        const m = url?.match(/(https?:\/\/[^\s|"]+)/);
        let targetUrl = m ? m[0] : null;
        if (!targetUrl) {
            result = createError(MOCK_ERROR_INVALID_URL, url);
        } else {
            let matchingKey = null;
            for (const targetKey in targets) {
                const target = targets[targetKey];
                const replacePattern = /\{[^\}]+\}/g;
                // ^$ important to match the whole URL
                const patternRegex = `^${target.pattern.replace(replacePattern, '[^\/]+')}$`;
                const regex = new RegExp(patternRegex);
                if (targetUrl && targetUrl.match(regex)) {
                    matchingKey = targetKey;
                    break;
                }
            }
            const found: MOCK_TARGET | null = matchingKey
                ? targets[matchingKey]
                : null;
            if (!found) {
                result = createError(MOCK_ERROR_NO_TARGET, `${targetUrl}`);
            } else {
                LOG.INFO(`Mocking curl request to: ${targetUrl}`);
                result = found.value;
                causeError = found.causeError || false;
                if (found.err) {
                    result = createError(found.err, targetUrl);
                }
            }
        }
    }
    const response =
        typeof result === 'string' ? result : JSON.stringify(result);
    return causeError ? response.replace('}', '') : response;
};

export const mockCurls = (targets: MOCK_TARGETS): jest.SpyInstance =>
    jest.spyOn(cmd, 'command').mockImplementation((request: string): string => {
        return getMockResult(targets, request);
    });
export const mockProperty = (object: any, key: string, value: any) => {
    const originalPlatform = object[key];
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
    });
    return originalPlatform;
};
export const resetProperty = (object: any, key: string, value: any) => {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
    });
};

export const mockCommand = (input: string | undefined, platform: string, opts: MOCK_OPTS = {}): string => {
    const isWSL = opts && opts.isWSL || false;
    const isBash = opts && opts.isBash || false;
    const isPowershell = opts && opts.isPowershell || false;
    const isCMD = opts && opts.isCMD || false;
    const returnInput = opts && opts.returnInput || false;
    // const isEmpty = opts && opts.isEmpty || false;
    const notInPath = opts && opts.notInPath || false;
    const isWin = (platform === 'win32');
    const isDebug = opts && opts.debug || false;
    if (typeof input === 'string') {
        // echo %USERNAME%
        const argument = cmd.getAppNameCmd(input, platform, opts);
        const command = cmd.getCommandName(input);
        const gcApp = input.match(/\(get-command\s*[^\)]+\)\.(?:path|source)/i)
        const isApp = gcApp || ['command', 'where', 'which'].includes(command);
        if (isApp) {
            return getMockedApp(input, platform, opts);
        }
        if (command === 'powershell.exe') {
            if (argument === '"[system.environment]::username"') {
                if (platform === 'win32' || (isWSL)) {
                    return 'Test User\n';
                } else if (platform === 'linux') {
                    return `${command} not found`;
                }
            }

        }

        if (command === 'echo' && argument) {
            switch (argument) {
                case '%username%':
                    return mockWinEnv('USERNAME', 'Test User', platform, opts);
                case '%userprofile%':
                    return mockWinEnv('USERPROFILE', 'C:\\Users\\Test User', platform, opts);
                case '$home':
                    const VALUES: VALUE_OPTIONS = {
                        default: '/home/testuser',
                        linux: '/home/testuser',
                        darwin: '/Users/testuser',
                        windows: {
                            ps: 'C:\\Users\\Test User',
                            bash: '/c/Users/Test User',
                        }
                    }
                    return mockLinuxEnv('$HOME', VALUES, platform, opts)
                case '$shell':
                    const VALUES_SHELL: VALUE_OPTIONS = {
                        default: '/some/other/bash',
                        linux: '/bin/bash',
                        darwin: '/bin/bash',
                        windows: {
                            cmd: '$SHELL',
                            ps: '',
                            bash: '/usr/bin/bash',
                        }
                    }
                    return mockLinuxEnv('$SHELL', VALUES_SHELL, platform, opts)
            }
        }
        if (command === 'whoami') {
            if (platform === 'win32') {
                return isCMD || isPowershell ? 'my-laptop\\Test User\n' : 'Test User\n';
                // return hasBash() ? 'Test User' : 'my-laptop\\Test User\n';
            } else if (isUnixLikePlattform()) {
                return 'testuser\n';
            }
        }

        if (returnInput && input) {
            // return the input as output
            return input;
        }
    }
    return '';
}

export const mockPlatform = (platform: string, opts: MOCK_OPTS = {}): MOCK_SYSTEM => {
    const isWSL = opts && opts.isWSL !== undefined ? opts.isWSL : false;
    mockProperty(process, 'platform', platform);
    const spyOS = jest.spyOn(os, 'release').mockImplementation(() => {
        switch (platform) {
            case 'darwin':
                return MOCKED_PLATFORMS.darwin;
            case 'win32':
                return MOCKED_PLATFORMS.win32;
            case 'linux':
                return isWSL ? MOCKED_PLATFORMS.wsl : MOCKED_PLATFORMS.linux;
            default:
                return MOCKED_PLATFORMS.default;
        }
    });

    // todo: testen
    opts.terminals = mockTerminals(opts, platform);
    if (opts.isEmpty === true) {
        opts.terminals = { cmd: false, ps: false, bash: false };
        opts.isBash = false;
        opts.isCMD = false;
        opts.isPowershell = false;
        // console.log(opts)
    }

    const spyCmd = jest.spyOn(cmd, 'command').mockImplementation((command) => {
        return mockCommand(command, platform, opts)
    });

    return {
        originalPlatform: process.platform,
        spyRelease: spyOS,
        spyCmd: spyCmd,
        opts: opts,
    }

};
export const resetPlatform = (mocked: MOCK_SYSTEM) => {
    resetProperty(process, 'platform', mocked.originalPlatform);
    mocked.spyRelease.mockRestore();
    if (mocked.spyCmd) {
        mocked.spyCmd.mockRestore();
    }
};
