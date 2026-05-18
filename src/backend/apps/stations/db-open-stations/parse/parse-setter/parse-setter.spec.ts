/**
 * @jest-environment node
 */
import { setContentValue } from './parse-setter';

describe('setContentValue()', () => {
    const FN = setContentValue;
    const key = 'testKey';
    const value = 'testValue';
    const VALID_INPUT = { [key]: { content: value } };
    const INVALID_INPUT = { [key]: value };
    const allKeys: string[] = [key];
    it('should set the content value correctly', () => {
        const current: any = {};
        FN(VALID_INPUT, current);
        expect(current[key]).toEqual(value);
    });
    it('should set the content value correctly and remove the key from allKeys', () => {
        const current: any = {};
        FN(VALID_INPUT, current, allKeys);
        expect(current[key]).toEqual(value);
        expect(allKeys).toEqual([]);
    });
    it('should not set the value if content is missing', () => {
        const current: any = {};
        FN(INVALID_INPUT, current);
        expect(current[key]).toBeUndefined();
    });
    it('should not overwrite existing value', () => {
        const current: any = { [key]: 'existingValue' };
        FN(VALID_INPUT, current);
        expect(current[key]).toEqual('existingValue');
    });
    it('should handle alternative keys', () => {
        const key = 'ParticipantRef';
        const alternativeKey = 'participant';
        const input = { [key]: { content: value } };
        const current: any = {};
        const allKeys: string[] = Object.keys(input);
        FN(input, current, allKeys);
        expect(current[alternativeKey]).toEqual('testValue');
        expect(current[key]).toBeUndefined();
        expect(allKeys).toEqual([]);
    });
});
