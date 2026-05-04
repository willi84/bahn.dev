import { DosPath, EmptyPath, ERROR, JsonObject, PosixPath } from '../../../../index.d';
import { TERMINALS } from '../../../../index.d';
export type MOCK_TARGET = {
    name: string;
    pattern: string;
    value: any;
    err?: any;
    causeError?: boolean;
};
export type MOCK_TARGETS = {
    [key: string]: MOCK_TARGET;
};
export type MOCK_RESULT = JsonObject | ERROR;

export type MOCK_APP = {
    name: string;
    path: {
        none: PosixPath|DosPath|EmptyPath;
        win32: {
            dos: DosPath|EmptyPath;
            unix: PosixPath|EmptyPath;
        },
        linux: {
            unix: PosixPath|EmptyPath;
            wsl: PosixPath|EmptyPath;
        },
        darwin: {
            unix: PosixPath|EmptyPath;
        },
    }
}
export type PATH_BASE = {
    windows: DosPath|EmptyPath,
    linux: PosixPath|EmptyPath,
    darwin: PosixPath|EmptyPath,
}

export type MOCK_SYSTEM = {
    originalPlatform: string;
    spyRelease: jest.SpyInstance;
    spyCmd: jest.SpyInstance;
    opts: MOCK_OPTS;
};

export type MOCK_OPTS = {
    isWSL?: boolean;
    isBash?: boolean;
    terminals?: TERMINALS;
    // isUnix?: boolean; // for unix styled systems of unix styles in win shells
    isPowershell?: boolean;
    isCMD?: boolean;
    returnInput?: boolean;
    isEmpty?: boolean;
    notInPath?: boolean; // for powershell
    noEnv?: string; // specified env not set
    debug?: boolean; // for debugging purposes
};
export type MOCK_TERMINALS = {
    cmd: boolean;
    ps: boolean;
    bash: boolean;
}
export type TERMINAL_FLAG = boolean | undefined;

export type VALUE_OPTIONS = {
    default?: string;
    linux?: string;
    darwin?: string;
    windows?: {
        ps?: string;
        cmd?: string;
        bash?: string;
    }
}
