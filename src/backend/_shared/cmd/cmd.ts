import { LOG } from '../log/log';
import type { MOCK_OPTS } from '../test_lib/utils/mock/mock.d';
const execSync = require('child_process').execSync;
export const command = (command: string, doLog = false, showError = false) => {
    let output: string = '';
    let errorText: string = '';
    try {
        output = execSync(`${command}`, { 
            timeout: 50000,
            maxBuffer: 150 * 1024 * 1024 
        }); // 10000
    } catch (e: any) {
        errorText = e;
    }
    if (doLog) {
        LOG.DEBUG(`${output.toString()}`);
    }
    if (showError && errorText !== '') {
        LOG.FAIL(`${errorText}`);
        LOG.DEBUG(`${output.toString()}`);
    }
    return output.toString();
};
export const commandSafe = (cmd: string): string[] => {
    const result = command(cmd);
    if (!result || result.trim() === '') {
        return [];
    }
    const allLines = result
        .split(/\r?\n|\r/)
        .map((line) => line.trim())
        .filter((line) => line !== '');
    return allLines;
};
export const commandSafeFirst = (cmd: string): string => {
    const result = commandSafe(cmd);
    return result && result.length > 0 ? result[0] : '';
};

export const getCommandName = (command: string): string => {
    let result = '';
    const parts = command.trim().toLowerCase().split(/\s+/); //remove spaces
    if (parts.length > 0) {
        const cmdName = parts[0].replace('(', '').replace(')', '');
        result = cmdName;
    }
    return result;
};

export const getAppNameCmd = (
    command: string,
    platform: string,
    opts?: MOCK_OPTS
): string => {
    const parts = command.trim().toLowerCase().split(/\s+/); //remove spaces and split by whitespace
    let result: string = '';
    const isWin = platform === 'win32';
    const isUnixSystem = platform === 'linux' || platform === 'darwin';
    const isUnix = (opts && opts.isBash) || false;
    const isLinux = platform === 'linux';
    const isWSL = (opts && opts.isWSL) || false;
    if (parts.length > 0) {
        const cmdName = parts[0].replace('(', '').replace(')', '');
        const argument = parts[1] === '-v' ? parts[2] : parts[1]; // get the app name from the command
        switch (cmdName) {
            case 'command':
                result = argument;
                break;
            case 'where':
                if (isWin) {
                    result = argument;
                }
                break;
            case 'which':
                if (isUnixSystem || isUnix) {
                    result = argument;
                }
                break;
            case 'get-command':
                if (isWin) {
                    result = argument
                        .replace(')', '')
                        .replace('.source', '')
                        .replace('.path', '');
                }
                break;
            default: // e.g. powershell.exe [argument]
                if (argument) return argument;
        }
    }
    return result.replace(/['"]/g, '').trim(); // remove quotes
};