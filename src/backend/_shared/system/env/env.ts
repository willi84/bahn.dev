import { LOG } from '../../log/log';
import { ENV, ENV_CHECK } from './env.d';

export const checkEnvVariables = (variables: string[]): ENV_CHECK => {
    const missing: string[] = [];
    const result: ENV_CHECK = {};
    for (const variable of variables) {
        let isValid = true;
        if (!process.env[variable]) {
            isValid = false;
            missing.push(variable);
        }
        result[variable] = {
            value: process.env[variable] || '',
            valid: isValid,
        };
    }
    return result;
};
export const showMissingEnvVariables = (env: ENV_CHECK): void => {
    const missingEnvVariables: string[] = [];
    for (const variable in env) {
        if (env.hasOwnProperty(variable) && !env[variable].valid) {
            missingEnvVariables.push(variable);
        }
    }
    if (missingEnvVariables.length > 0) {
        const missingVars = missingEnvVariables.join(',');
        LOG.FAIL(`Missing environment variables: {RED}${missingVars}{/RED}`);
        const text = `Please set the following environment variables in your .bashrc:\n`;
        const space = ' '.repeat(10);
        LOG.NEWLINE(
            `${space}{YELLOW}${text}{/YELLOW}`
        );
        missingEnvVariables.forEach((envVar) => {
            LOG.NEWLINE(`${space}export ${envVar}=<value>`);
        });
        process.exit(0);
    } else {
        LOG.OK('All required environment variables are set.');
    }
};
export const getEnv = (variables: string[]): ENV => {
    const env: ENV_CHECK = checkEnvVariables(variables);
    const result: ENV = {}
    for(const variable of variables) {
        if(env[variable] && env[variable].valid) {
            result[variable] = env[variable].value;
        }
    }
    showMissingEnvVariables(env);
    return result;
}