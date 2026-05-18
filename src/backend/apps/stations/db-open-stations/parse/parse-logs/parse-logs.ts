import { LogType } from '../../../../../_shared/log/log.config';
import { PARSE_LOG } from '../parse';

export class ParseLogs {
    logs: PARSE_LOG[] = [];
    constructor(logs: PARSE_LOG[] = []) {
        this.logs = logs;
    }
    addLog(log: PARSE_LOG) {
        this.logs.push(log);
    }
    addWarning(message: string, value: any) {
        this.addLog({
            type: LogType.WARN,
            message,
            value,
        });
    }
    addInfo(message: string, value: any) {
        this.addLog({
            type: LogType.INFO,
            message,
            value,
        });
    }
    addError(message: string, value: any) {
        this.addLog({
            type: LogType.FAIL,
            message,
            value,
        });
    }
    getLogs() {
        return this.logs;
    }
    getFilteredLogs(type: LogType) {
        return this.logs.filter(log => log.type === type).map(log => {
            return {
                message: log.message,
                value: log.value,
            }
        });
    }
    getWarnings() {
        return this.getFilteredLogs(LogType.WARN);
    }
    getErrors() {
        return this.getFilteredLogs(LogType.FAIL);
    }
}