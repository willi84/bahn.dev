export type SystemSettings = {
    cwd: string;
    isMicrosoft: boolean;
    isMac: boolean;
    isLinux: boolean;
    isWindows: boolean;
    isWsl: boolean;
    hasPowershell: boolean;
    hasBash: boolean;
    hasCode: boolean;
    windowsUser: string|undefined;
    linuxUser: string|undefined;
    noEmoji: boolean;
    home: string;
    // windowsHome: string;
}

