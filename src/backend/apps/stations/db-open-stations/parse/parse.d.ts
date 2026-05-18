import type { LogType } from '../../../../_shared/log/log.config';
export type PARSE_LOG = {
    type: LogType;
    message: string;
    value: any
}