import { TERMINAL } from '../../../..';
import { MOCK_TERMINALS, MOCK_OPTS } from './mock.d';


export const MOCK_ERROR_NO_TARGET = 'No target found for key';
export const MOCK_ERROR_INVALID_URL = 'No valid URL found in the curl command';
export const MOCK_ERROR_UNKNOWN = 'unknown error';
export const MOCK_ERROR_NO_CURL = 'No curl command found';

export const MOCKED_PLATFORMS = {
    darwin: 'Darwin 20.3.0',
    linux: 'Linux 5.4.0-42-generic',
    win32: 'Windows_NT 10.0.19042',
    wsl: '4.4.0.19041-Microsoft',
    default: '5.4.0-42-generic'
};


export const NO_OPTS: MOCK_OPTS = {};
export const IS_BASH: MOCK_OPTS = { isBash: true};
export const IS_CMD: MOCK_OPTS = { isCMD: true };
export const IS_PS: MOCK_OPTS = { isPowershell: true };

export const ONLY_PS: MOCK_OPTS = { isPowershell: true, isCMD: false, isBash: false, terminals: { cmd: false, ps: true, bash: false } };
export const ONLY_BASH: MOCK_OPTS = { isBash: true, isCMD: false, isPowershell: false, terminals: { cmd: false, ps: false, bash: true } };
export const ONLY_CMD: MOCK_OPTS = { isCMD: true, isBash: false, isPowershell: false, terminals: { cmd: true, ps: false, bash: false } };

export const IS_CMD_PS: MOCK_OPTS = { isCMD: true, isPowershell: true}
export const IS_BASH_PS: MOCK_OPTS = { isBash: true, isPowershell: true };
export const IS_BASH_CMD: MOCK_OPTS = { isBash: true, isCMD: true };
export const IS_BASH_CMD_PS: MOCK_OPTS = { isBash: true, isCMD: true, isPowershell: true };
export const IS_WSL: MOCK_OPTS = {isWSL: true};

export const BASH: TERMINAL = 'bash';
export const CMD: TERMINAL = 'cmd';
export const PS: TERMINAL = 'ps';

export const NO_BASH: MOCK_OPTS = { isBash: false};
export const NO_CMD: MOCK_OPTS = { isCMD: false };
export const NO_PS: MOCK_OPTS = { isPowershell: false };
export const NO_PS_BASH: MOCK_OPTS = { isPowershell: false, isBash: false };

export const NO_TERMINALS: MOCK_TERMINALS = { cmd: false, ps: false, bash: false };
export const _PS: MOCK_TERMINALS = { cmd: false, ps: true, bash: false };
export const _BASH: MOCK_TERMINALS = { cmd: false, ps: false, bash: true };
export const _CMD: MOCK_TERMINALS = { cmd: true, ps: false, bash: false };

export const BASH_CMD: MOCK_TERMINALS = { cmd: true, ps: false, bash: true };
export const BASH_PS: MOCK_TERMINALS = { cmd: false, ps: true, bash: true };
export const CMD_PS: MOCK_TERMINALS = { cmd: true, ps: true, bash: false };
export const BASH_CMD_PS: MOCK_TERMINALS = { cmd: true, ps: true, bash: true };

export const T_BASH: MOCK_OPTS =   { terminals: { cmd: false, ps: false, bash: true } };
export const T_CMD: MOCK_OPTS =    { terminals: { cmd: true, ps: false, bash: false } };
export const T_PS: MOCK_OPTS =     { terminals: { cmd: false, ps: true, bash: false } };
export const T_BASH_CMD: MOCK_OPTS =   { terminals: { cmd: true, ps: false, bash: true } };
export const T_BASH_PS: MOCK_OPTS =    { terminals: { cmd: false, ps: true, bash: true } };
export const T_CMD_PS: MOCK_OPTS =     { terminals: { cmd: true, ps: true, bash: false } };
export const T_BASH_CMD_PS: MOCK_OPTS =    { terminals: { cmd: true, ps: true, bash: true } };
export const T_NO_TERMINALS: MOCK_OPTS =   { terminals: { cmd: false, ps: false, bash: false } };

export const RETURN_INPUT: MOCK_OPTS = { returnInput: true };
