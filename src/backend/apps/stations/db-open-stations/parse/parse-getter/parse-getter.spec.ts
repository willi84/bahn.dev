/**
 * @jest-environment node
 */
import { ParseLogs } from '../parse-logs/parse-logs';
import { getFrameRef, getPartOfJSON } from './parse-getter';

describe('✅ getFrameRef()', () => {
    const FN = getFrameRef;
    const INPUT =  {
        version: '1777771020',
        id: 
            'epd:de:DB:CompositeFrame:EU_PI_STOP_OFFER:DB:20abdf7b-3640-5895-98ef-c32264a55564',
            children: [
                {
                    TypeOfFrameRef: { ref: 'epip:EU_PI_STOP_OFFER', versionRef: '1.0' },
                },
                {
                    frames: {
                        children: [
                            {
                                xXFrame: {
                                    version: '1777771020',
                                    id: 
                                        'epd:de:DB:XXFrame:EU_PI_STOP:DB:b83c01df-dc88-50ce-81d8-4eca5a43e917',
                                    children: []
                                }
                            },
                        ]   
                    },
                }
        ]
    };
    it('should return the correct frameRef', () => {
        const logs: ParseLogs = new ParseLogs();
        
        const EXPECTED = {
            version: '1777771020',
            id: 
                'epd:de:DB:XXFrame:EU_PI_STOP:DB:b83c01df-dc88-50ce-81d8-4eca5a43e917',
            children: []
        };
        expect(FN(INPUT, 'xXFrame', logs)).toEqual(EXPECTED);
        expect(logs.getErrors()).toEqual([]);
    });
    it('should return the correct frameRef', () => {
        const logs: ParseLogs = new ParseLogs();
        
        const EXPECTED = {};
        expect(FN(INPUT, 'loremFrame', logs)).toEqual(EXPECTED);
        expect(logs.getErrors()).toEqual([
            {
                message: `Frame not found in metadata`,
                value: {
                    searched: 'loremFrame',
                    availableFrames: ['xXFrame']
                }
            }
        ]);
    });
});
describe('✅ getPartOfJSON()', () => {
    const FN = getPartOfJSON;
    const CompositeFrame = {
        children: [
            {},
            {},
            {},
            {
                frames: {
                    children: [
                        {
                            SiteFrame: 'siteFrame'
                        }
                    ]
                }
            }
        ]
    };
    const INPUT = {
        PublicationDelivery: {
            children: [
                {},
                {},
                {
                    dataObjects: {
                        children: [
                            {
                                CompositeFrame
                            }
                        ]
                    }
                }
            ]
        }
    };
    it('should return the stops part of JSON', () => {
        const EXPECTED = 'siteFrame';
        expect(FN(INPUT, 'stops')).toEqual(EXPECTED);
    });
    it('should return the metadata part of JSON', () => {
        const EXPECTED = 'metadata';
        expect(FN(INPUT, EXPECTED)).toEqual(CompositeFrame);
    });
    it('should return the ressources part of JSON', () => {
        const EXPECTED = 'ressources';
        expect(FN(INPUT, EXPECTED)).toEqual({ CompositeFrame });
    });
    it('should return an empty object if the part is not found', () => {
        const EXPECTED = {};
        expect(FN(INPUT, 'lorem')).toEqual(EXPECTED);
    });
});