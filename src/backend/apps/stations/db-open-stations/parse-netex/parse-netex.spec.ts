/**
 * @jest-environment node
 */
import { getMetaData, getRessources, getStops } from './parse-netex';
import { SAMPLE_NETEX } from './test-data/netex_1';
import { LOG } from '../../../../_shared/log/log';
import { PARSE_LOG } from '../parse/parse';
import { ParseLogs } from '../parse/parse-logs/parse-logs';
import { LogType } from '../../../../_shared/log/log.config';

// const TEST_JSON =  FS.readFile('./src/backend/apps/stations/db-open-stations/parse-netex/test-data/netex.json');
const TEST_JSON = SAMPLE_NETEX;

export const getPartOfSample = (json: any, part: string) => {
    switch (part) {
        case 'stops':
            return (
                json.PublicationDelivery.children[2].dataObjects.children[0]
                    .CompositeFrame.children[3].frames.children[0].SiteFrame ||
                {}
            );
        case 'metadata':
            return json.PublicationDelivery.children[2].dataObjects.children[0]
                .CompositeFrame;
        case 'ressources':
            return json.PublicationDelivery.children[2].dataObjects.children[0];
        default:
            return {};
    }
};
let warnSpy: any;
let okSpy: any;
beforeEach(() => {
    warnSpy = jest.spyOn(LOG, 'WARN');
    okSpy = jest.spyOn(LOG, 'OK');
});
afterEach(() => {
    warnSpy.mockRestore();
    okSpy.mockRestore();
});

describe('getMetadata', () => {
    it('should return the correct metadata', () => {
        const FN = getMetaData;
        const INPUT = TEST_JSON;
        const EXPECTED = {
            version: '1777771020',
            meta: {
                compositeFrame: {
                    publicated: '2026-05-03T01:35:59.483Z',
                    participant: 'DB',
                    version: '1777771020',
                    frameRef: {
                        'epip:EU_PI_STOP_OFFER': '1.0',
                    },
                    id: 'epd:de:DB:CompositeFrame:EU_PI_STOP_OFFER:DB:20abdf7b-3640-5895-98ef-c32264a55564',
                    xml: {
                        ns1: 'http://www.netex.org.uk/netex',
                        ns2: 'http://www.opengis.net/gml/3.2',
                        ns3: 'http://www.siri.org.uk/siri',
                    },
                    keyList: {
                        NORMALIZED_ID_URI:
                            'http://netex-cen.eu/epip_data/de%3ADB%3ACompositeFrame%3AEU_PI_STOP_OFFER%3ADB',
                    },
                    codespaces: {
                        ags: {
                            url: 'http://dcat-ap.de/def/politicalGeocoding/municipalityKey/',
                            description:
                                'German municipality identifier (AGS, Amtlicher Gemeindeschlüssel).',
                        },
                        dbinfrago: {
                            url: 'https://daten.bahnhof.de/namespace/dbinfrago/',
                            description:
                                'Identifiers governed by DB InfraGO AG, used on objects for which no standardized ID schema applies.',
                        },
                        'dbinfrago-temporary': {
                            url: 'https://daten.bahnhof.de/namespace/dbinfrago-temporary/',
                            description:
                                'Placeholder identifiers for objects for which no stable identifier (DHID, DIID) has been assigned yet. IDs in this codespace have a limited lifespan and will be discontinued once a stable identifier from another codespace has been assigned to the entity. Do not use these IDs in other datasets.',
                        },
                        diid: {
                            url: 'https://id.vdv.de/diid/',
                            description:
                                'German infrastructure object identifier (DIID), still to be defined.',
                        },
                        epd: {
                            url: 'http://netex-cen.eu/epip_data/',
                            description: 'EPIP Data',
                        },
                        epip: {
                            url: 'http://netex-cen.eu/epip/',
                            description: 'EPIP Metadata',
                        },
                        dhid: {
                            url: 'https://id.vdv.de/dhid/',
                            description:
                                'German station identifier (DHID), as defined in VDV-432.',
                        },
                    },
                },
            },
        };
        const logs: ParseLogs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
    });
});
describe('getRessources', () => {
    const FN = getRessources;
    it('should return the correct ressources', () => {
        const INPUT = TEST_JSON;
        const EXPECTED = {
            keyList: {
                NORMALIZED_ID_URI:
                    'http://netex-cen.eu/epip_data/de%3ADB%3ASiteFrame%3AEU_PI_COMMON%3ADB',
            },
            frameRef: {
                'epip:EU_PI_COMMON': '1.0',
            },
            typesOfValue: {
                quays: {
                    name: 'Ausprägungstypen von Quays',
                    lang: 'de',
                    version: 'any',
                    values: {
                        'quay:platformHeight': 'Höhe einer Bahnsteigkante',
                        'quay:section': 'Gleisabschnitt z.B. Gleis 1 B',
                        'quay:maxLengthTrain':
                            'Gleisbezogene Bahnsteignutzlänge',
                    },
                },
                'epd:eu:ValueSet:PassengerInformationEquipments': {
                    name:
                        'Ausprägungstypen von PassengerInformationEquipments',
                    lang: 'de',
                    version: 'any',
                    values: {
                        'epd:eu:TypeOfPassengerInformationEquipment:NextStopDisplay':
                            'Next Stop Display',
                        'epd:eu:TypeOfPassengerInformationEquipment:NextStopAnnouncement':
                            'Next Stop Announcement',
                        'epd:eu:TypeOfPassengerInformationEquipment:OnBoardInfo':
                            'On Board Information System',
                        'epd:eu:TypeOfPassengerInformationEquipment:InfoTerminal':
                            'Self Service Information Terminal',
                        'epd:eu:TypeOfPassengerInformationEquipment:DepMon':
                            'Departure Monitor',
                        'epd:eu:TypeOfPassengerInformationEquipment:HelpDesk':
                            'Help Desk',
                    },
                },
                'dbinfrago:eu:ValueSet:PassengerInformationEquipments': {
                    name:
                        'Ausprägungstypen von PassengerInformationEquipments',
                    lang: 'de',
                    version: 'any',
                    values: {
                        'dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements':
                            'Departure Announcements (Audio)',
                    },
                },
            },
            organisations: {
                'dbinfrago:3bed9dbc-0878-51b1-ab57-8f7f9c821c78': {
                    version: '0',
                    keyList: {
                        NORMALIZED_ID_URI:
                            'https://daten.bahnhof.de/namespace/dbinfrago/3bed9dbc-0878-51b1-ab57-8f7f9c821c78',
                    },
                    vatNumber: 'DE199861757',
                    name: 'DB InfraGO AG',
                    shortName: 'DB InfraGO AG',
                    contactDetails: {
                        email: 'feedback+openstation@bahnhof.de',
                        furtherDetails:
                            'Beachten Sie den Datenschutzhinweis zur Kontaktaufnahme unter https://bahnhof.de/datenschutz',
                    },
                    organisationType: 'facilityOperator',
                },
            },
            responsibilitySets: {
                'dbinfrago:1da13d58-da67-55db-8d92-891d111c7126': {
                    version: '0',
                    lang: 'de',
                    name: 'Bahnhofsmanagement Saarbrücken',
                    keyList: {
                        NORMALIZED_ID_URI:
                            'https://daten.bahnhof.de/namespace/dbinfrago/1da13d58-da67-55db-8d92-891d111c7126',
                    },
                    roles: {
                        'dbinfrago:14fe4ff7-2d62-5d88-88ed-6d9ae254e232': {
                            version: '0',
                            status: 'active',
                            responsibilitySetRef:
                                'dbinfrago:1da13d58-da67-55db-8d92-891d111c7126',
                            description:
                                'Zuständigkeit Bahnhofsmanagement Auersmacher',
                            dataRoleType: 'aggregates',
                            stakeholderRoleType: 'Operation',
                            responsibleOrganisationRef: 'dbinfrago:3bed9dbc-0878-51b1-ab57-8f7f9c821c78',
                        },
                        'dbinfrago:7ed3786b-ae66-5ebb-8817-7b7938be7278': {
                            version: '0',
                            // status: 'active',
                            responsibilitySetRef:
                                'dbinfrago:1da13d58-da67-55db-8d92-891d111c7126',
                            description:
                                'Zuständigkeit Bahnhofsmanagement Auersmacher',
                            dataRoleType: 'creates',
                            stakeholderRoleType: {},
                            responsiblePartRef: {
                                ref: 'dbinfrago:204b56aa-b8ff-5a07-b64b-5964aeb415f9',
                                'xmlns:xsi':
                                    'http://www.w3.org/2001/XMLSchema-instance',
                                'xsi:type': 'OrganisationalUnitRefStructure',
                            },
                        },
                    },
                },
            },
            // '1777686780'
        };
        const logs: ParseLogs = new ParseLogs();
        expect(FN(INPUT, logs)).toEqual(EXPECTED);
    });
});
describe('getStops()', () => {
    const FN = getStops;
    it('should return the correct stops', () => {
        const INPUT: any = TEST_JSON;
        // const INPUT: any = getPartOfSample(TEST_JSON, 'stops');
        const EXPECTED = {
            version: '1777771020',
            keyList: {
                NORMALIZED_ID_URI: 
                'http://netex-cen.eu/epip_data/de%3ADB%3ASiteFrame%3AEU_PI_STOP%3ADB'
            },
            frameRef: { 'epip:EU_PI_STOP': '1.0' },
            stops: {
                'dhid:de:11000:900120005:EdB': {
                    responsibilitySetRef: 'dbinfrago:e8247abb-dffb-5f4b-935e-c70df2623b9a',
                    version: '1777686780',
                    keyList: {
                        NORMALIZED_ID_URI: 'https://id.vdv.de/dhid/de%3A11000%3A900120005%3AEdB',
                        EVA: '8089185',
                        RIL: 'BOSB',
                        DBINFRAGO_STATION_CATEGORY: '1',
                        DBINFRAGO_PRICE_CATEGORY: '1'
                    },
                    name: 'Berlin Ostbahnhof',
                    lang: 'de',
                    privateCode: '530',
                    placeTypes: {
                        typeOfPlaceRef: { ref: 'epip:monomodal', versionRef: '1.0' }
                    },
                    url: 'https://www.bahnhof.de/id/530',
                    postalAddress: {
                        version: '1777686780',
                        id: 'dbinfrago:98a968ce-45e0-539a-a40e-f54728f94269',
                        street: 'Koppenstr. 3',
                        town: 'Berlin',
                        postCode: '10243',
                        province: 'Berlin'
                    },
                    accessibilityAssessment: {
                        id: "dbinfrago:dc06e66c-d061-5d71-846f-f09c87e6812b",
                        version: '0',
                        mobilityImpairedAccess: 'false',
                        limitations:  { 
                             'dbinfrago:fb3c56a6-8ff6-5e1c-b554-d31e44b46b71':  { 
                                audibleSignalsAvailable: "true",
                                escalatorFreeAccess: 'unknown',
                                guideDogAccess: 'true',
                                levelAccessIntoVehicle: 'unknown',
                                liftFreeAccess: 'unknown',
                                rampFreeAccess: 'true',
                                stairFreeAccess: 'unknown',
                                stepFreeAccess: 'unknown',
                                tactileGuidanceAvailable: 'unknown',
                                visualSignsAvailable: 'true',
                                wheelchairAccess: 'unknown' 
                            } 
                        },
                    },
                    publicUse: 'all',
                    gated: 'openArea',
                    lighting: 'wellLit',
                    topographicPlaceRef: { ref: 'ags:11000000', version: 'any' },
                    siteType: 'transport',
                    locale: { timeZone: 'Europe/Berlin', defaultLanguage: 'de-DE' },
                    parentSiteRef: { ref: 'dhid:de:11000:900120005', version: 'any' },
                    entrances: {
                        'diid:08a84c1b-9292-57f9-98ba-c7911c7a56f0': {
                        version: '0',
                        keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/08a84c1b-9292-57f9-98ba-c7911c7a56f0' },
                        name: 'Bahnhofsvorplatz',
                        lang: 'de',
                        publicUse: 'all',
                        gated: 'openArea',
                        siteRef: 'dhid:de:11000:900120005:EdB',
                        isExternal: 'true',
                        isEntry: 'true',
                        isExit: 'true'
                        }
                    },
                    placeEquipments: {
                        'diid:02b2be0f-c1da-1eef-a490-ce37aef397ae': {
                            version: '0',
                            keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-ce37aef397ae' },
                            name: 'Gleis 11 Verstärker 41 T-LSPe',
                            lang: 'de',
                            privateCode: '10587277',
                            fixed: 'true',
                            passengerInformationEquipmentList: 'realTimeDepartures realTimeDisruptions networkStatus',
                            typeOfPassengerInformationEquipmentRef: {
                                ref: 'dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements',
                                version: 'any'
                            }
                        }
                    },
                    localServices: {
                        'diid:7ab96572-3590-448a-a880-b8e64065c345': {
                            version: '0',
                            validityConditions: {
                                'dbinfrago-temporary:20803ffd-c1b6-4054-9e3d-7e190281f53a':  { 
                                    dayTypes:  { 
                                        'dbinfrago-temporary:47970131-a4aa-462c-9aff-7c0a066df408':  { 
                                            lang: 'de',
                                            name: 'PH 06:00-22:30',
                                            properties: {
                                                propertyOfDay: {
                                                    holidayTypes: 'NationalHoliday RegionalHoliday LocalHoliday',
                                                },
                                            },
                                            timebands: {
                                                'dbinfrago-temporary:676567b2-c3ec-43ba-9ae8-8958bbc4bccf': {
                                                    endTime: '22:30:00',
                                                    startTime: '06:00:00',
                                                    version: 'any',
                                                },
                                            },
                                            version: 'any' 
                                        }
                                    },
                                    version: 'any' 
                                } 
                            },
                            keyList: {
                                "NORMALIZED_ID_URI": "https://id.vdv.de/diid/7ab96572-3590-448a-a880-b8e64065c345",
                            },
                            name: 'Mobilitätsservice',
                            lang: 'de',
                            infoLinks: { infoLink: 'https://www.bahnhof.de/service/mobilitaetsservice' }, // TODO
                            assistanceFacilityList: 'boardingAssistance wheelchairAssistance',
                            assistanceAvailability: 'availableIfBooked',
                            staffing: 'partTime',
                            languages: 'de-DE',
                            accessibilityTrainedStaff: 'true'
                        }
                    },
                    transportMode: 'rail',
                    stopPlaceType: 'railStation',
                    unlocalisedEquipments: {
                        'diid:f12b5f0f-08b6-4174-bbc1-f7f38575e69f': {
                            version: '0',
                            keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/f12b5f0f-08b6-4174-bbc1-f7f38575e69f' },
                            name: 'Toilette',
                            lang: 'de',
                            description: 'im Osttunnel',
                            sanitaryFacilityList: 'toilet'
                        }
                    },
                    quays: {
                        'dbinfrago-temporary:02b2be0f-c1da-1eef-a490-e84b6a71d7af': {
                            version: '1777686780',
                            keyList: { NORMALIZED_ID_URI: 'https://daten.bahnhof.de/namespace/dbinfrago-temporary/02b2be0f-c1da-1eef-a490-e84b6a71d7af' },
                            name: 'S-Bahnsteig 01 Gleis 8/9',
                            lang: 'de',
                            privateCode: '00530-01-SB1',
                            accessibilityAssessment: {
                                id: 'dbinfrago:8826d191-71d1-566c-8daf-c590cfd3bbe8',
                                limitations:  { 
                                    'dbinfrago:3cc2a65d-34df-5779-99ca-873b6f274bdd':  { 
                                        audibleSignalsAvailable: 'true',
                                        escalatorFreeAccess: 'unknown',
                                        guideDogAccess: 'true',
                                        levelAccessIntoVehicle: 'unknown',
                                        liftFreeAccess: 'unknown',
                                        rampFreeAccess: 'true',
                                        stairFreeAccess: 'unknown',
                                        stepFreeAccess: 'unknown',
                                        tactileGuidanceAvailable: 'unknown',
                                        visualSignsAvailable: 'true',
                                        wheelchairAccess: 'unknown' 
                                    } 
                                },
                                mobilityImpairedAccess: 'false',
                                version: '0' 
                            },
                            publicUse: 'all',
                            covered: 'unknown',
                            gated: 'openArea',
                            lighting: 'wellLit',
                            siteRef: 'dhid:de:11000:900120005:EdB',
                            equipmentPlaces: { 
                                'diid:f6a32f7e-dc96-5cd0-9ed4-70ce12a4afb5':  { 
                                    keyList: { NORMALIZED_ID_URI: 'https://id.vdv.de/diid/f6a32f7e-dc96-5cd0-9ed4-70ce12a4afb5' },
                                    placeEquipments: { passengerInformationEquipmentRef: { ref: 'diid:02b2be0f-c1da-1fd0-95e0-245f48b41513' } },
                                    publicUse: 'all',
                                    version: '0' 
                                } 
                            },
                            transportMode: 'rail',
                            boardingUse: 'true',
                            alightingUse: 'true',
                            quayType: 'railIslandPlatform'
                        }
                    },
                    accessSpaces: {
                        'diid:02b2be0f-c1da-1eef-a490-f7a4a2be37b2': {
                            accessSpaceType: 'concourse',
                            covered: 'indoors',
                            gated: 'openArea',
                            keyList: {
                                'EQ-ID': '10812952',
                                NORMALIZED_ID_URI: 'https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-f7a4a2be37b2',
                                'TP-ID': '00530-04'
                            },
                            lang: 'de',
                            accessibilityAssessment: {
                                id: 'dbinfrago:66e16a81-c9d2-51b1-b18b-193466b20061',
                                limitations:  { 
                                    'dbinfrago:43cfdac7-6cab-5b19-a75c-6c47f63d684e':  { 
                                        audibleSignalsAvailable: 'false',
                                        escalatorFreeAccess: 'unknown',
                                        guideDogAccess: 'true',
                                        levelAccessIntoVehicle: 'false',
                                        liftFreeAccess: 'unknown',
                                        rampFreeAccess: 'true',
                                        stairFreeAccess: 'unknown',
                                        stepFreeAccess: 'unknown',
                                        tactileGuidanceAvailable: 'unknown',
                                        visualSignsAvailable: 'true',
                                        wheelchairAccess: 'unknown' 
                                    } 
                                },
                                mobilityImpairedAccess: 'false',
                                version: '0' 
                            },
                            lighting: 'wellLit',
                            name: 'Empfangsgebäude / Bauteil 3',
                            passageType: 'other',
                            privateCode: '00530-04',
                            publicUse: 'all',
                            siteRef: 'dhid:de:11000:900120005:EdB',
                            version: '0',
                        },
                        // gated: 'openArea',
                    },
                    pathLinks: {
                        'dbinfrago:780fec8d-d080-5670-9322-ba42cf5a01b7': {
                            version: '0',
                            keyList: {
                                "NORMALIZED_ID_URI": "https://daten.bahnhof.de/namespace/dbinfrago/780fec8d-d080-5670-9322-ba42cf5a01b7",
                            },
                            name: 'Treppe Bstg. 1/Westtunnel ↔ Bahnsteig A / Gleis 1',
                            lang: 'de',
                            from: { placeRef: { ref: 'diid:7e16f68f-a873-5f1f-b8ca-9f54a9c828b2' } }, // TODO
                            to: { placeRef: { ref: 'dbinfrago-temporary:02b2be0f-c1da-1eef-a490-f69996bb37b1' } },
                            publicUse: 'all',
                            allowedUse: 'twoWay',
                            siteRef: 'dhid:de:11000:900120005:EdB',
                            placeEquipments: { staircaseEquipmentRef: { ref: 'diid:02b2be0f-c1da-1eef-a490-e019524df7ae' } },
                        }
                    }
                }
            }
        };
        const logs: ParseLogs = new ParseLogs();
        const result = FN(INPUT, logs);
        expect(result).toEqual(EXPECTED);
    });
});
