import { LOG } from '../../log/log';
import { checkEnvVariables, getEnv, showMissingEnvVariables } from './env';

describe('system/env', () => {
    describe('✅ checkEnvVariables()', () => {
        const fn = checkEnvVariables;
        beforeEach(() => {
            delete process.env.ABCDEF_TEST;
        })
        it('should return false if no environment variable is set', () => {
            const result = fn(['ABCDEF_TEST'])
            expect(result).toEqual({ ABCDEF_TEST: { value: '', valid: false } });
        });
        it('should return the environment variable being set', () => {
            process.env.ABCDEF_TEST = 'test';
            const result = fn(['ABCDEF_TEST'])
            expect(result).toEqual({ ABCDEF_TEST: { value: 'test', valid: true } });
            delete process.env.ABCDEF_TEST;
        });
        it('should return all environment variables set', () => {
            process.env.ABCDEF_TEST = 'test';
            process.env.ABCDEF_TEST2 = 'test2';
            const result = fn(['ABCDEF_TEST', 'ABCDEF_TEST2'])
            expect(result).toEqual({
                ABCDEF_TEST: { value: 'test', valid: true },
                ABCDEF_TEST2: { value: 'test2', valid: true },
            });
            delete process.env.ABCDEF_TEST;
            delete process.env.ABCDEF_TEST2;
        });
    });
    describe('✅ showMissingEnvVariables()', () => {
        const fn = showMissingEnvVariables;
        it('should log missing environment variables', () => {
            const env = {
                ABCDEF_TEST: { value: '', valid: false },
                ABCDEF_TEST2: { value: 'test2', valid: true },
            };
            const spyFail = jest.spyOn(LOG, 'FAIL' );
            const spyOK = jest.spyOn(LOG, 'OK' );
            fn(env);
            expect(spyFail).toHaveBeenCalledWith(
                `Missing environment variables: {RED}ABCDEF_TEST{/RED}`
            );
            expect(spyOK).not.toHaveBeenCalled();
            spyFail.mockRestore();
            spyOK.mockRestore();
        });
        it('should not log if no environment variables are missing', () => {
            const env = {
                ABCDEF_TEST: { value: 'test', valid: true },
            };
            const spyOK = jest.spyOn(LOG, 'OK' );
            const spyFail = jest.spyOn(LOG, 'FAIL' );
            fn(env);
            expect(spyFail).not.toHaveBeenCalled();
            spyFail.mockRestore();
            expect(spyFail).not.toHaveBeenCalled();
                expect(spyOK).toHaveBeenCalledWith(
                `All required environment variables are set.`
            );
        });
    });
    describe('✅ getEnv()', () => {
        const fn = getEnv;
        beforeEach(() => {
            delete process.env.ABCDEF_TEST;
            delete process.env.ABCDEF_TEST2;
        });
        it('should return an empty object if no environment variables are set', () => {
            const result = fn(['ABCDEF_TEST', 'ABCDEF_TEST2']);
            expect(result).toEqual({});
        });
        it('should return the environment variable being set', () => {
            process.env.ABCDEF_TEST = 'test';
            const result = fn(['ABCDEF_TEST']);
            expect(result).toEqual({ ABCDEF_TEST: 'test' });
            delete process.env.ABCDEF_TEST;
        });
        it('should return all environment variables set', () => {
            process.env.ABCDEF_TEST = 'test';
            process.env.ABCDEF_TEST2 = 'test2';
            const result = fn(['ABCDEF_TEST', 'ABCDEF_TEST2']);
            expect(result).toEqual({
                ABCDEF_TEST: 'test',
                ABCDEF_TEST2: 'test2',
            });
            delete process.env.ABCDEF_TEST;
            delete process.env.ABCDEF_TEST2;
        });
    });
});