/**
 * @jest-environment node
 */
import { ParseLogs } from '../parse-logs/parse-logs';
import { getCodespaces, getRoles, getStop, getStopDetail, getValueSet, handleStandardSet } from './parse-parts';

const NORMALIZED_ID_URI__ = 'https://robert.bahnhof.de/foobar';
const keyList = {
    children: [
    {
        "KeyValue": {
        children: [
            {
            "Key": {
                content: "NORMALIZED_ID_URI"
            }
            },
            {
            "Value": {
                content: NORMALIZED_ID_URI__
            }
            }
        ]
        }
    }
    ]
};

const KEY_VALUE = (key: string, value: string) => {
    return {
        KeyValue: {
            children: [
                {
                    Key: { content: key},
                }, {
                    Value: { content: value}
                }
            ]
        }
    }
}
const CHILDREN = (array: any[]) => {
    return {
        children: array
    };
}

const REF = (ref: string, versionRef?: string) => {
    return versionRef ? { ref, versionRef} : { ref };
}
const REF_2 = (ref: string, version?: string) => {
    return version ? { ref, version} : { ref };
}
const CONTENT = (content: string, lang?: string) => {
    return lang ? { content, lang } : { content };

}
const NORMALIZED_ID_URI = (target: string) => {
    return KEY_VALUE('NORMALIZED_ID_URI', target);

}


describe('✅ getRoles()', () => {
    const FN = getRoles;
    const roles = [
        {
            "ResponsibilitySetRef": {
                "ref": "dbinfrago:1da13d58-da67-55db-8d92-891d111c7126"
            }
        },
        {
            "Description": {
                lang: "de",
                content: "Zuständigkeit Bahnhofsmanagement Auersmacher"
            }
        },
        {
            "DataRoleType": {
                content: "aggregates"
            }
        },
        {
            "ResponsiblePartRef": {
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:type": "OrganisationalUnitRefStructure",
                "ref": "dbinfrago:204b56aa-b8ff-5a07-b64b-5964aeb415f9"
            }
        }
    ];
    const id = 'dbinfrago:14fe4ff7-2d62-5d88-88ed-6d9ae254e232';
    const EXPECTED = 
            {
            [id]: {
                version: '0',
                status: 'active',
                responsibilitySetRef: 'dbinfrago:1da13d58-da67-55db-8d92-891d111c7126',
                description: 'Zuständigkeit Bahnhofsmanagement Auersmacher',
                dataRoleType: 'aggregates',
                responsiblePartRef: {
                    ref: 'dbinfrago:204b56aa-b8ff-5a07-b64b-5964aeb415f9',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:type': 'OrganisationalUnitRefStructure',
                },
            },
        };
    it('should return the correct roles', () => {
        const INPUT: any = {
            roles: {
                children: [
                    {
                        ResponsibilityRoleAssignment: {
                            version: "0",
                            status: "active",
                            id,
                            children: roles
                        }
                    }
                ]
            }
        };
        
        const logs: ParseLogs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getLogs()).toEqual([]);
    });
    it('should return a warning if a role is missing a responsibilitySetRef', () => {
        const id = 'dbinfrago:14fe4ff7-2d62-5d88-88ed-6d9ae254e232';
        const INPUT: any = {
            roles: {
                children: [
                    {
                        XXX: {
                            version: "0",
                            status: "active",
                            id,
                            children: roles
                        }
                    }
                ]
            }
        };
        
        const logs: ParseLogs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([
            {
                message: `Role node does not contain a ResponsibilityRoleAssignment`,
                value: 'XXX'
            }
        ]);
    });
});
describe('✅ getCodespaces()', () => {
    const FN = getCodespaces;
    const CodespaceChildren = [
        {
            "Xmlns": {
                content: "dhid"
            }
        },
        {
            XmlnsUrl: {
                content: 'http://dcat-ap.de/def/politicalGeocoding/municipalityKey/'
            }
        },
        {
            Description: {
                content: 'German municipality identifier (AGS, Amtlicher Gemeindeschlüssel).'
            }
        }
    ];
    it('should return the correct codespaces', () => {
        const logs: ParseLogs = new ParseLogs();
        const INPUT = {
            children: [
                {
                    Codespace: {
                        id: 'dhid',
                        children: CodespaceChildren
                    }
                }
            ]
        };
        const EXPECTED = {
            'dhid': {
                url: 'http://dcat-ap.de/def/politicalGeocoding/municipalityKey/',
                description: 'German municipality identifier (AGS, Amtlicher Gemeindeschlüssel).'
            }

        }
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getLogs()).toEqual([]);
    });
    it('should return an error if id and xmlns are different', () => {
        const logs: ParseLogs = new ParseLogs();
        const INPUT = {
            children: [
                {
                    Codespace: {
                        id: 'xxx',
                        children: CodespaceChildren
                    }
                }
            ]
        };
        const EXPECTED = {
            'xxx': {
                url: 'http://dcat-ap.de/def/politicalGeocoding/municipalityKey/',
                description: 'German municipality identifier (AGS, Amtlicher Gemeindeschlüssel).'
            }

        }
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([
            {
                message: `Codespace id does not match the xml ns `,
                value: {
                    id: 'xxx',
                    xmlns: 'dhid'
                }
            }
        ]);
    });
    it('should return an error if Codespace Key is missing', () => {
        const logs: ParseLogs = new ParseLogs();
        const INPUT = {
            children: [
                {
                    XXX: {
                        id: 'dhid',
                        children: CodespaceChildren
                    }
                }
            ]
        };
        const EXPECTED = {
            'dhid': {
                url: 'http://dcat-ap.de/def/politicalGeocoding/municipalityKey/',
                description: 'German municipality identifier (AGS, Amtlicher Gemeindeschlüssel).'
            }

        }
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([
            {
                message: `Codespace node does not contain a Codespace child`,
                value: {
                    expected: 'Codespace',
                    actual: 'XXX'
                }
            }
        ]);
    });
});
describe('✅ getValueSet()', () => {
    const FN = getValueSet;
    it('should return the correct value set', () => {
        const INPUT =  [
                {
                    Name: {
                        content: 'Test',
                        lang: 'en'
                    }
                },
                {
                    values: {
                        children: [
                            {
                                TypeOfPlace: {
                                version: "any",
                                id: "quay:platformHeight",
                                children: [
                                    {
                                        Name: {
                                            lang: "de",
                                            content: "Höhe einer Bahnsteigkante"
                                        }
                                    }
                                ]
                                }
                            },
                        ]
                    }
                }
            ];
        const EXPECTED = {
            // version: '1.0',
            name: 'Test',
            lang: 'en',
            values: {
                "quay:platformHeight": "Höhe einer Bahnsteigkante"
            }
        };
        const logs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([]);
    });
});
describe('✅ handleStandardSet()', () => {
    const FN = handleStandardSet;
    const expected = 'ValueSet';
    it('should return the correct value set', () => {
        
        const INPUT = 
            {
                children: [
                    { 
                        ValueSet: { 
                            version: 'any', 
                            id: 'quays', 
                            children: [ { x: 'y' } ] } 
                    },
                    {
                        ValueSet: {
                            version: 'any',
                            id: 'epd:eu:ValueSet:PassengerInformationEquipments',
                            children: [  ]
                        }
                    },
                ]
                    };
        const EXPECTED = 
            {
                quays: { 
                    version: 'any', 
                    x: 'y' 
                },
                'epd:eu:ValueSet:PassengerInformationEquipments': { 
                    version: 'any' 
                }
            };
        const logs = new ParseLogs();
        expect(FN(INPUT, expected, logs)).toEqual(EXPECTED);
        expect(logs.getLogs()).toEqual([]);
        expect(logs.getWarnings()).toEqual([]);
    });
    it('should return the correct organisations', () => {
        const INPUT = {
            children: [
                {
                    XXX: {
                        version: 'any',
                        id: 'dbinfrago:204b56aa-b8ff-5a07-b64b-5964aeb415f9',
                        keyList,
                        children: [
                            { Name: { lang: 'de', content: 'DB Station&Service AG' } },
                            { ShortName: { lang: 'de', content: 'DB Station&Service' } },
                        ]
                    }
                }
            ]
        };
        const EXPECTED = {
            'dbinfrago:204b56aa-b8ff-5a07-b64b-5964aeb415f9': {
                version: 'any',
                name: 'DB Station&Service AG',
                shortName: 'DB Station&Service',
                lang: 'de',
                keyList: {
                    NORMALIZED_ID_URI: 'https://robert.bahnhof.de/foobar'
                }
            }
        };
        const logs = new ParseLogs();
        expect(FN(INPUT, expected, logs)).toEqual(EXPECTED);
        expect(logs.getWarnings()).toEqual([
            {
                message: `node does not contain an ${expected} child`,
                value: { actual: 'XXX', expected }
            }
        ]);
    });
});
describe('getStopDetail()', () => {
    const FN = getStopDetail;
    it('should return the correct stop', () => {
        const INPUT: any = {
            Entrance: {
                version: '0',
                id: 'diid:08a84c1b-9292-57f9-98ba-XXX',
                children: [
                    { keyList },
                    { Name: { lang: 'de', content: 'Bahnhofsvorplatz' } },
                    { PublicUse: { content: 'all' } },
                    { Gated: { content: 'openArea' } },
                    { SiteRef: { ref: 'dhid:de:11000:900120005:EdB' } },
                    { IsExternal: { content: 'true' } },
                    { IsEntry: { content: 'true' } },
                    { IsExit: { content: 'true' } },
                ]
            }
        } 
        const EXPECTED = {
            'diid:08a84c1b-9292-57f9-98ba-XXX': {
                version: '0',
                name: 'Bahnhofsvorplatz',
                lang: 'de',
                publicUse: 'all',
                gated: 'openArea',
                siteRef: 'dhid:de:11000:900120005:EdB',
                isExternal: 'true',
                isEntry: 'true',
                isExit: 'true',
                // locale: {
                //     timeZone: 'Europe/Berlin',
                //     defaultLanguage: 'de-DE'
                // },
                // entrances: {
                //     'diid:08a84c1b-9292-57f9-98ba-c7911c7a56f0': 
                //         { 
                //             // gated: 'openArea',
                //             // isEntry: 'true',
                //             // isExit: 'true',
                //             isExternal: 'true',
                //             name: 'Bahnhofsvorplatz',
                //             publicUse: 'all',
                //             version: '0',
                //             keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/08a84c1b-9292-57f9-98ba-c7911c7a56f0' },
                //         }
                // },
                keyList: {
                    NORMALIZED_ID_URI: NORMALIZED_ID_URI__
                }
            }
        };
        const logs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
        expect(logs.getLogs()).toEqual([]);
    });
});
describe('getStop()', () => {
    const FN = getStop;
    it('should return the correct stop', () => {
        const id = "dhid:de:10041:8000651:EdB";
        const INPUT: any = {
            StopPlace: {
                responsibilitySetRef: "dbinfrago:1da13d58-da67-55db-8d92-891d111c7126",
                version: "0",
                id,
                children: [
                    {
                        keyList: {
                            children: [
                                NORMALIZED_ID_URI('https://id.vdv.de/dhid/de%3A10041%3A8000651%3AEdB'),
                                KEY_VALUE('EVA', '8000651'),
                                KEY_VALUE('RIL', 'SAM'),
                                KEY_VALUE('DBINFRAGO_STATION_CATEGORY', '6'),
                                KEY_VALUE('DBINFRAGO_PRICE_CATEGORY', '2')
                            ]
                        }
                    },
                    { Name: CONTENT("Auersmacher", "de") },
                    { PrivateCode: CONTENT("213") },
                    {
                        placeTypes: {
                            children: [
                                {
                                    "TypeOfPlaceRef": REF('epip:monomodal', '1.0')
                                }
                            ]
                        }
                    },
                    { Url: CONTENT("https://www.bahnhof.de/id/213") },
                    {
                        PostalAddress: {
                            version: "0",
                            id: "dbinfrago:593e4387-ff86-5e5e-9819-fe56e73bb753",
                            children: [
                                { Street: CONTENT("Kreisstr. 14", "de") },
                                { PostCode: CONTENT("66271") }
                            ]
                        }
                    },
                    {
                        AccessibilityAssessment: {
                            version: "0",
                            id: "dbinfrago:2de7bcb1-9064-5f2b-8cdd-6cccf83bd6ad",
                            children: [
                                { MobilityImpairedAccess: CONTENT("true") },
                                {
                                    limitations: CHILDREN([
                                            {
                                                AccessibilityLimitation: {
                                                    id: "dbinfrago:3d92520a-e07c-53fc-8e58-3a319f6631f7",
                                                    children: [
                                                        { EscalatorFreeAccess: CONTENT("unknown") },
                                                        { GuideDogAccess: CONTENT("true") }
                                                    ]
                                            }
                                        }
                                    ])
                            }
                        ]
                    }
                    },
                    { PublicUse: CONTENT('all') },
                    { Gated: CONTENT('openArea') },
                    { Lighting: CONTENT('wellLit') },
                    { TopographicPlaceRef: REF("ags:10041514", "any") },
                    { SiteType: CONTENT("transport") },
                    {
                        Locale: CHILDREN([
                            { TimeZone: CONTENT("Europe/Berlin") },
                            { DefaultLanguage: CONTENT("de-DE") }
                        ])
                    },
                    { ParentSiteRef: REF('dhid:de:10041:8000651', 'any') },
                    {
                    entrances: {
                        children: [
                        {
                            Entrance: {
                            version: "0",
                            id: "diid:caf96962-d116-5f0f-9c56-01894c4df76f",
                            children: [
                                { 
                                    keyList: CHILDREN([
                                        NORMALIZED_ID_URI('https://id.vdv.de/diid/caf96962-d116-5f0f-9c56-01894c4df76f'),
                                    ])
                                },
                                { Name: CONTENT("Vorplatz", "de") },
                                { PublicUse: CONTENT("all") },
                                { SiteRef: REF('dhid:de:10041:8000651:EdB') }
                            ]
                            }
                        }
                        ]
                    }
                    },
                    {
                    placeEquipments: {
                        children: [
                        {
                            "PassengerInformationEquipment": {
                            version: "0",
                            id: "diid:c6cb7451-b9df-54c6-b95c-b6d238d5d165",
                            children: [
                                { 
                                    keyList: CHILDREN([
                                        NORMALIZED_ID_URI('https://id.vdv.de/diid/c6cb7451-b9df-54c6-b95c-b6d238d5d165'),
                                    ])
                                },
                                { Name: CONTENT("DSA+_Typ2S_Gl1_SAM1", "de") },
                                { PassengerInformationEquipmentList: CONTENT("realTimeDepartures realTimeDisruptions networkStatus") },
                                { TypeOfPassengerInformationEquipmentRef: REF_2("dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements", "any"),
                                }
                            ]
                            }
                        }
                        ]
                    }
                    },
                    { TransportMode: CONTENT("rail") },
                    { StopPlaceType: CONTENT("railStation") },
                    {
                    quays: {
                        children: [
                        {
                            Quay: {
                            version: "0",
                            id: "dhid:de:10041:8000651:1",
                            children: [
                                {
                                keyList: {
                                    children: [
                                        NORMALIZED_ID_URI('https://id.vdv.de/dhid/de%3A10041%3A8000651%3A1'),
                                        KEY_VALUE('EQ-ID', '10812294')                                            
                                    ]
                                }
                                },
                                { Name: CONTENT("Bahnsteig Gl. 1 (Ri SB), einschl. Zugang", "de") },
                                { PrivateCode: CONTENT("00213-01-B01") },
                                {
                                    AccessibilityAssessment: {
                                        version: "0",
                                        id: "dbinfrago:a151a369-4d6d-5cce-8ad1-887fcf3f97a5",
                                        children: [
                                            { MobilityImpairedAccess: CONTENT('true') },
                                            {
                                                limitations: {
                                                    children: [
                                                        {
                                                        "AccessibilityLimitation": {
                                                            id: "dbinfrago:8578e8be-4011-5d31-ab93-561b1b00315f",
                                                            children: [
                                                                { StairFreeAccess: CONTENT("true") },
                                                                {  EscalatorFreeAccess: CONTENT("unknown") }
                                                            ]
                                                        }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                { PublicUse: CONTENT("all") },
                                { SiteRef: REF('dhid:de:10041:8000651:EdB') },
                                {
                                    equipmentPlaces: {
                                        children: [
                                        {
                                            EquipmentPlace: {
                                                version: "0",
                                                id: "diid:6c44ae9e-c9aa-5ef5-84f4-69a9d6af4f9a",
                                                children: [
                                                    {
                                                        keyList: {
                                                            children: [
                                                                NORMALIZED_ID_URI('https://id.vdv.de/diid/6c44ae9e-c9aa-5ef5-84f4-69a9d6af4f9a')
                                                            ]
                                                        }
                                                    },
                                                    { PublicUse: CONTENT("all") },
                                                    {
                                                        placeEquipments: {
                                                            children: [
                                                            {
                                                                PassengerInformationEquipmentRef: REF("diid:c6cb7451-b9df-54c6-b95c-b6d238d5d165")
                                                            }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            EquipmentPlace: {
                                                version: "0",
                                                id: "diid:e3bfaab9-4411-5663-a4ec-42a4c5c28962",
                                                children: [
                                                    {
                                                    keyList: {
                                                        children: [
                                                            NORMALIZED_ID_URI('https://id.vdv.de/diid/e3bfaab9-4411-5663-a4ec-42a4c5c28962')
                                                        ]
                                                    }
                                                    },
                                                    { PublicUse: CONTENT("all") },
                                                    {
                                                        placeEquipments: {
                                                            children: [
                                                                { PassengerInformationEquipmentRef: REF("diid:a95bba0f-8cf0-5250-90b0-290e65bedf45") }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                        ]
                                    }
                                },
                                { TransportMode: CONTENT('rail')},
                                { AlightingUse: CONTENT('true')},
                                { Length: CONTENT('80.00')}
                            ]
                            }
                        },
                    ]
                }
                    },
                    {
                    accessSpaces: {
                        children: [
                        {
                            "AccessSpace": {
                            version: "0",
                            id: "diid:02b2be0f-c1da-1eef-a490-edced67097af",
                            children: [
                                {
                                "keyList": {
                                    children: [
                                        NORMALIZED_ID_URI('https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-edced67097af'),
                                        KEY_VALUE('TP-ID', '00213-05')
                                    ]
                                }
                                },
                                { Name: CONTENT("Vorplatz", "de") },
                                { PrivateCode: CONTENT("00213-05") },
                                {
                                "AccessibilityAssessment": {
                                    version: "0",
                                    id: "dbinfrago:00a7de55-92ba-56c6-8e74-eeaa9407d36c",
                                    children: [
                                        { MobilityImpairedAccess: CONTENT("false") },
                                        {
                                            limitations: {
                                                children: [
                                                    {
                                                    "AccessibilityLimitation": {
                                                        id: "dbinfrago:8648530a-7d19-5ce5-875f-1edf5af46d0f",
                                                        children: [
                                                            { LiftFreeAccess: CONTENT("unknown") },
                                                            { RampFreeAccess: CONTENT("true") },
                                                            { LevelAccessIntoVehicle: CONTENT("false") }
                                                        ]
                                                    }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                                },
                                { PublicUse: CONTENT("all") },
                                { Gated: CONTENT("openArea") },
                                { Lighting: CONTENT("wellLit") },
                                { SiteRef: REF("dhid:de:10041:8000651:EdB") },
                                { AccessSpaceType: CONTENT("forecourt") }
                            ]
                            }
                        }
                        ]
                    }
                    },
                    {
                    pathLinks: {
                        children: [
                        {
                            SitePathLink: {
                                version: "0",
                                id: "dbinfrago:82c4434d-ba57-5bb5-9832-7701b4eef540",
                                children: [
                                    {
                                    "keyList": {
                                        children: [
                                            NORMALIZED_ID_URI('https://daten.bahnhof.de/namespace/dbinfrago/82c4434d-ba57-5bb5-9832-7701b4eef540')
                                        ]
                                    }
                                    },
                                    { Name: CONTENT("DSA+_Typ2S_Gl2_SAM2 ↔ Bahnsteig Gl. 2 (Ri Sarreguemines/F.)", "de") },
                                    {
                                        To: CHILDREN([
                                            { PlaceRef: REF('dhid:de:10041:8000651:2') },
                                        ])
                                    },
                                    {
                                        From: CHILDREN([
                                            { PlaceRef: REF('diid:396fb4fa-ab93-5c41-913e-5b98f7346052') },
                                        ])
                                    },
                                    { SiteRef: REF('dhid:de:10041:8000651:EdB') },
                                    {
                                        placeEquipments: CHILDREN([
                                            { PassengerInformationEquipmentRef: REF('diid:940892ff-6e85-5095-8105-cdc4602ca881') }
                                        ])
                                    }
                                ]
                            }
                        }
                        ]
                    }
                    }
                ]
            }
        };
        const EXPECTED = {
            [id]: {
                version: '0',
                gated: 'openArea',
                keyList: {
                    'RIL': 'SAM',
                    'DBINFRAGO_PRICE_CATEGORY': '2',
                    'EVA': '8000651',
                    'DBINFRAGO_STATION_CATEGORY': '6',
                    'NORMALIZED_ID_URI': 'https://id.vdv.de/dhid/de%3A10041%3A8000651%3AEdB'
                },
                lang: 'de',
                lighting: 'wellLit',
                locale: { defaultLanguage: 'de-DE', timeZone: 'Europe/Berlin' },
                name: 'Auersmacher',
                parentSiteRef: { ref: 'dhid:de:10041:8000651', version: 'any' },
                accessSpaces: { 
                    'diid:02b2be0f-c1da-1eef-a490-edced67097af':  { 
                        accessSpaceType: 'forecourt',
                        accessibilityAssessment: 
                        { 
                            id: 'dbinfrago:00a7de55-92ba-56c6-8e74-eeaa9407d36c',
                            limitations: { 
                                'dbinfrago:8648530a-7d19-5ce5-875f-1edf5af46d0f': {
                                    levelAccessIntoVehicle: 'false',
                                    liftFreeAccess: 'unknown',
                                    rampFreeAccess: 'true' 
                                }
                            },
                            mobilityImpairedAccess: 'false',
                            version: '0' 
                        },
                        gated: 'openArea',
                        keyList: 
                            { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-edced67097af',
                            'TP-ID': '00213-05' },
                        lang: 'de',
                        lighting: 'wellLit',
                        name: 'Vorplatz',
                        privateCode: '00213-05',
                        publicUse: 'all',
                        siteRef: 'dhid:de:10041:8000651:EdB',
                        version: '0' 
                    } 
                },
                accessibilityAssessment:  { 
                    id: 'dbinfrago:2de7bcb1-9064-5f2b-8cdd-6cccf83bd6ad',
                    limitations: { 
                        'dbinfrago:3d92520a-e07c-53fc-8e58-3a319f6631f7': { 
                            escalatorFreeAccess: 'unknown', 
                            guideDogAccess: 'true' 
                        } 
                    },
                    mobilityImpairedAccess: 'true',
                    version: '0' 
                },
                postalAddress: 
                { 
                    id: 'dbinfrago:593e4387-ff86-5e5e-9819-fe56e73bb753',
                    postCode: '66271',
                    street: 'Kreisstr. 14',
                    version: '0'
                },
                entrances: { 
                    'diid:caf96962-d116-5f0f-9c56-01894c4df76f':  {
                        version : '0',
                        keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/caf96962-d116-5f0f-9c56-01894c4df76f' },
                        lang: 'de',
                        name: 'Vorplatz',
                        publicUse: 'all',
                        siteRef: 'dhid:de:10041:8000651:EdB' 
                    }
                },
                placeEquipments:  { 
                    'diid:c6cb7451-b9df-54c6-b95c-b6d238d5d165':  { 
                        keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/c6cb7451-b9df-54c6-b95c-b6d238d5d165' },
                        lang: 'de', // TODO: von name
                        name: 'DSA+_Typ2S_Gl1_SAM1',
                        passengerInformationEquipmentList: 'realTimeDepartures realTimeDisruptions networkStatus',
                        typeOfPassengerInformationEquipmentRef:  { 
                            ref: 'dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements',
                            version: 'any' 
                        },
                        version: '0' 
                    } 
                },
                pathLinks: { 
                    'dbinfrago:82c4434d-ba57-5bb5-9832-7701b4eef540': { 
                        from: { placeRef: { ref: 'diid:396fb4fa-ab93-5c41-913e-5b98f7346052' } },
                        keyList: { NORMALIZED_ID_URI: 'https://daten.bahnhof.de/namespace/dbinfrago/82c4434d-ba57-5bb5-9832-7701b4eef540' },
                        lang: 'de',
                        name: 'DSA+_Typ2S_Gl2_SAM2 ↔ Bahnsteig Gl. 2 (Ri Sarreguemines/F.)',
                        placeEquipments: { 
                            passengerInformationEquipmentRef: { 
                                ref: 'diid:940892ff-6e85-5095-8105-cdc4602ca881' 
                            } 
                        },
                        siteRef: 'dhid:de:10041:8000651:EdB',
                        to: { placeRef: { ref: 'dhid:de:10041:8000651:2' } },
                        version: '0' 
                    } 
                },
                placeTypes: { typeOfPlaceRef: { ref: 'epip:monomodal', versionRef: '1.0' } },
                privateCode: '213',
                publicUse: 'all',
                responsibilitySetRef: 'dbinfrago:1da13d58-da67-55db-8d92-891d111c7126',
                siteType: 'transport',
                stopPlaceType: 'railStation',
                topographicPlaceRef: { ref: 'ags:10041514', version: 'any' },
                transportMode: 'rail',
                url: 'https://www.bahnhof.de/id/213',
                quays:  { 
                    'dhid:de:10041:8000651:1':  { 
                        accessibilityAssessment:  { 
                            id: 'dbinfrago:a151a369-4d6d-5cce-8ad1-887fcf3f97a5',
                            limitations: { 
                                'dbinfrago:8578e8be-4011-5d31-ab93-561b1b00315f': { 
                                    escalatorFreeAccess: 'unknown', 
                                    stairFreeAccess: 'true' 
                                } 
                            },
                            mobilityImpairedAccess: 'true',
                            version: '0' 
                        },
                        alightingUse: 'true',
                        equipmentPlaces: { 
                            'diid:e3bfaab9-4411-5663-a4ec-42a4c5c28962':  { 
                                keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/e3bfaab9-4411-5663-a4ec-42a4c5c28962' },
                                placeEquipments: { passengerInformationEquipmentRef: { ref: 'diid:a95bba0f-8cf0-5250-90b0-290e65bedf45' } },
                                publicUse: 'all',
                                version: '0' 
                            } 
                        },
                        keyList:  { 
                            'EQ-ID': '10812294',
                            NORMALIZED_ID_URI: 'https://id.vdv.de/dhid/de%3A10041%3A8000651%3A1' 
                        },
                        lang: 'de',
                        length: '80.00',
                        name: 'Bahnsteig Gl. 1 (Ri SB), einschl. Zugang',
                        privateCode: '00213-01-B01',
                        publicUse: 'all',
                        siteRef: 'dhid:de:10041:8000651:EdB',
                        transportMode: 'rail',
                        version: '0' 
                    } 
                },
            }
        }
        const logs = new ParseLogs();
        const result = FN(INPUT, logs);
        expect(logs.getLogs()).toEqual([]);
        expect(result).toEqual(EXPECTED);
    });
});