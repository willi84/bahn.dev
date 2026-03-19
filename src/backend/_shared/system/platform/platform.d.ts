import {
    WIN, MAC, LIN, BSD, OTH,
    WINDOWS, LINUX, MACOS, OTHER, // IDs
 } from './platform.config';

// wrapper for NodeJS.Platform to include custom platform codes
// 'darwin' | 'win32' | 'linux' | 'freebsd' | 'other';
export type PLATFORM_CODE = WIN | MAC | LINUX | FREEBSD | OTHER | NodeJS.Platform;

// unified platform id for easier usage in code
export type PLATFORM_ID = MACOS | WINDOWS | LINUX | OTHER;
