const data = {
  "PublicationDelivery": {
    "xmlns": "http://www.netex.org.uk/netex",
    "xmlns:ns2": "http://www.opengis.net/gml/3.2",
    "xmlns:ns3": "http://www.siri.org.uk/siri",
    "version": "1777771020",
    "children": [
      {
        "PublicationTimestamp": {
          "content": "2026-05-03T01:35:59.483Z"
        }
      },
      {
        "ParticipantRef": {
          "content": "DB"
        }
      },
      {
        "dataObjects": {
          "children": [
            {
              "CompositeFrame": {
                "version": "1777771020",
                "id": "epd:de:DB:CompositeFrame:EU_PI_STOP_OFFER:DB:20abdf7b-3640-5895-98ef-c32264a55564",
                "children": [
                  {
                    "keyList": {
                      "children": [
                        {
                          "KeyValue": {
                            "children": [
                              {
                                "Key": {
                                  "content": "NORMALIZED_ID_URI"
                                }
                              },
                              {
                                "Value": {
                                  "content": "http://netex-cen.eu/epip_data/de%3ADB%3ACompositeFrame%3AEU_PI_STOP_OFFER%3ADB"
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "TypeOfFrameRef": {
                      "ref": "epip:EU_PI_STOP_OFFER",
                      "versionRef": "1.0"
                    }
                  },
                  {
                    "codespaces": {
                      "children": [
                        {
                          "Codespace": {
                            "id": "dhid",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "dhid"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "https://id.vdv.de/dhid/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "German station identifier (DHID), as defined in VDV-432."
                                }
                              }
                            ]
                          }
                        },
                        {
                          "Codespace": {
                            "id": "diid",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "diid"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "https://id.vdv.de/diid/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "German infrastructure object identifier (DIID), still to be defined."
                                }
                              }
                            ]
                          }
                        },
                        {
                          "Codespace": {
                            "id": "dbinfrago",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "dbinfrago"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "https://daten.bahnhof.de/namespace/dbinfrago/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "Identifiers governed by DB InfraGO AG, used on objects for which no standardized ID schema applies."
                                }
                              }
                            ]
                          }
                        },
                        {
                          "Codespace": {
                            "id": "epip",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "epip"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "http://netex-cen.eu/epip/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "EPIP Metadata"
                                }
                              }
                            ]
                          }
                        },
                        {
                          "Codespace": {
                            "id": "epd",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "epd"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "http://netex-cen.eu/epip_data/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "EPIP Data"
                                }
                              }
                            ]
                          }
                        },
                        {
                          "Codespace": {
                            "id": "ags",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "ags"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "http://dcat-ap.de/def/politicalGeocoding/municipalityKey/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "German municipality identifier (AGS, Amtlicher Gemeindeschlüssel)."
                                }
                              }
                            ]
                          }
                        },
                        {
                          "Codespace": {
                            "id": "dbinfrago-temporary",
                            "children": [
                              {
                                "Xmlns": {
                                  "content": "dbinfrago-temporary"
                                }
                              },
                              {
                                "XmlnsUrl": {
                                  "content": "https://daten.bahnhof.de/namespace/dbinfrago-temporary/"
                                }
                              },
                              {
                                "Description": {
                                  "content": "Placeholder identifiers for objects for which no stable identifier (DHID, DIID) has been assigned yet. IDs in this codespace have a limited lifespan and will be discontinued once a stable identifier from another codespace has been assigned to the entity. Do not use these IDs in other datasets."
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "frames": {
                      "children": [
                        {
                          "SiteFrame": {
                            "version": "1777771020",
                            "id": "epd:de:DB:SiteFrame:EU_PI_STOP:DB:b83c01df-dc88-50ce-81d8-4eca5a43e917",
                            "children": [
                              {
                                "keyList": {
                                  "children": [
                                    {
                                      "KeyValue": {
                                        "children": [
                                          {
                                            "Key": {
                                              "content": "NORMALIZED_ID_URI"
                                            }
                                          },
                                          {
                                            "Value": {
                                              "content": "http://netex-cen.eu/epip_data/de%3ADB%3ASiteFrame%3AEU_PI_STOP%3ADB"
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                "TypeOfFrameRef": {
                                  "ref": "epip:EU_PI_STOP",
                                  "versionRef": "1.0"
                                }
                              },
                              {
                                "stopPlaces": {
                                  "children": [
                                    {
                                      "StopPlace": {
                                        "responsibilitySetRef": "dbinfrago:e8247abb-dffb-5f4b-935e-c70df2623b9a",
                                        "version": "1777686780",
                                        "id": "dhid:de:11000:900120005:EdB",
                                        "children": [
                                          {
                                            "keyList": {
                                              "children": [
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "NORMALIZED_ID_URI"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "https://id.vdv.de/dhid/de%3A11000%3A900120005%3AEdB"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "EVA"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "8010255"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "EVA"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "8089185"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "RIL"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "BHF"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "RIL"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "BOSB"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "DBINFRAGO_STATION_CATEGORY"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "1"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "DBINFRAGO_PRICE_CATEGORY"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "1"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "Name": {
                                              "lang": "de",
                                              "content": "Berlin Ostbahnhof"
                                            }
                                          },
                                          {
                                            "PrivateCode": {
                                              "content": "530"
                                            }
                                          },
                                          {
                                            "placeTypes": {
                                              "children": [
                                                {
                                                  "TypeOfPlaceRef": {
                                                    "ref": "epip:monomodal",
                                                    "versionRef": "1.0"
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "Url": {
                                              "content": "https://www.bahnhof.de/id/530"
                                            }
                                          },
                                          {
                                            "PostalAddress": {
                                              "version": "1777686780",
                                              "id": "dbinfrago:98a968ce-45e0-539a-a40e-f54728f94269",
                                              "children": [
                                                {
                                                  "Street": {
                                                    "lang": "de",
                                                    "content": "Koppenstr. 3"
                                                  }
                                                },
                                                {
                                                  "Town": {
                                                    "lang": "de",
                                                    "content": "Berlin"
                                                  }
                                                },
                                                {
                                                  "PostCode": {
                                                    "content": "10243"
                                                  }
                                                },
                                                {
                                                  "Province": {
                                                    "lang": "de",
                                                    "content": "Berlin"
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "AccessibilityAssessment": {
                                              "version": "0",
                                              "id": "dbinfrago:dc06e66c-d061-5d71-846f-f09c87e6812b",
                                              "children": [
                                                {
                                                  "MobilityImpairedAccess": {
                                                    "content": "false"
                                                  }
                                                },
                                                {
                                                  "limitations": {
                                                    "children": [
                                                      {
                                                        "AccessibilityLimitation": {
                                                          "id": "dbinfrago:fb3c56a6-8ff6-5e1c-b554-d31e44b46b71",
                                                          "children": [
                                                            {
                                                              "WheelchairAccess": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "StepFreeAccess": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "StairFreeAccess": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "EscalatorFreeAccess": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "LiftFreeAccess": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "RampFreeAccess": {
                                                                "content": "true"
                                                              }
                                                            },
                                                            {
                                                              "LevelAccessIntoVehicle": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "AudibleSignalsAvailable": {
                                                                "content": "true"
                                                              }
                                                            },
                                                            {
                                                              "VisualSignsAvailable": {
                                                                "content": "true"
                                                              }
                                                            },
                                                            {
                                                              "TactileGuidanceAvailable": {
                                                                "content": "unknown"
                                                              }
                                                            },
                                                            {
                                                              "GuideDogAccess": {
                                                                "content": "true"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "PublicUse": {
                                              "content": "all"
                                            }
                                          },
                                          {
                                            "Gated": {
                                              "content": "openArea"
                                            }
                                          },
                                          {
                                            "Lighting": {
                                              "content": "wellLit"
                                            }
                                          },
                                          {
                                            "TopographicPlaceRef": {
                                              "ref": "ags:11000000",
                                              "versionRef": "any"
                                            }
                                          },
                                          {
                                            "SiteType": {
                                              "content": "transport"
                                            }
                                          },
                                          {
                                            "Locale": {
                                              "children": [
                                                {
                                                  "TimeZone": {
                                                    "content": "Europe/Berlin"
                                                  }
                                                },
                                                {
                                                  "DefaultLanguage": {
                                                    "content": "de-DE"
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "ParentSiteRef": {
                                              "ref": "dhid:de:11000:900120005",
                                              "versionRef": "any"
                                            }
                                          },
                                          {
                                            "entrances": {
                                              "children": [
                                                {
                                                  "Entrance": {
                                                    "version": "0",
                                                    "id": "diid:08a84c1b-9292-57f9-98ba-c7911c7a56f0",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/08a84c1b-9292-57f9-98ba-c7911c7a56f0"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Bahnhofsvorplatz"
                                                        }
                                                      },
                                                      {
                                                        "PublicUse": {
                                                          "content": "all"
                                                        }
                                                      },
                                                      {
                                                        "Gated": {
                                                          "content": "openArea"
                                                        }
                                                      },
                                                      {
                                                        "SiteRef": {
                                                          "ref": "dhid:de:11000:900120005:EdB"
                                                        }
                                                      },
                                                      {
                                                        "IsExternal": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "IsEntry": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "IsExit": {
                                                          "content": "true"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "placeEquipments": {
                                              "children": [
                                                {
                                                  "AccessVehicleEquipment": {
                                                    "version": "0",
                                                    "id": "diid:02b2be0f-c1da-1eef-adc2-8f2b62429b0d",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-adc2-8f2b62429b0d"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Mobile Einstiegshilfe Gl. 6/7"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10935429"
                                                        }
                                                      },
                                                      {
                                                        "Fixed": {
                                                          "content": "false"
                                                        }
                                                      },
                                                      {
                                                        "Hoist": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "Ramp": {
                                                          "content": "false"
                                                        }
                                                      },
                                                      {
                                                        "BearingCapacity": {
                                                          "content": "350.00"
                                                        }
                                                      },
                                                      {
                                                        "SuitableFor": {
                                                          "content": "wheelchair assistedWheelchair"
                                                        }
                                                      },
                                                      {
                                                        "AssistedBoardingLocation": {
                                                          "content": "boardOnlyAtSpecifiedPositions"
                                                        }
                                                      },
                                                      {
                                                        "GuideDogsAllowed": {
                                                          "content": "true"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "LiftEquipment": {
                                                    "version": "1777686780",
                                                    "id": "diid:02b2be0f-c1da-1eef-a490-9ce5083437ac",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-9ce5083437ac"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "zu Gleis 8/9 (S-Bahn)"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10378152"
                                                        }
                                                      },
                                                      {
                                                        "infoLinks": {
                                                          "children": [
                                                            {
                                                              "InfoLink": {
                                                                "content": "https://www.bahnhof.de/id/530/aufzuege"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Width": {
                                                          "content": "1.00"
                                                        }
                                                      },
                                                      {
                                                        "Height": {
                                                          "content": "2.00"
                                                        }
                                                      },
                                                      {
                                                        "DirectionOfUse": {
                                                          "content": "both"
                                                        }
                                                      },
                                                      {
                                                        "SafeForGuideDog": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "Depth": {
                                                          "content": "2.93"
                                                        }
                                                      },
                                                      {
                                                        "MaximumLoad": {
                                                          "content": "2000.00"
                                                        }
                                                      },
                                                      {
                                                        "WheelchairPassable": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "WheelchairTurningCircle": {
                                                          "content": "1.34"
                                                        }
                                                      },
                                                      {
                                                        "InternalWidth": {
                                                          "content": "1.34"
                                                        }
                                                      },
                                                      {
                                                        "InternalHeight": {
                                                          "content": "2.18"
                                                        }
                                                      },
                                                      {
                                                        "ThroughLoader": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "Attendant": {
                                                          "content": "false"
                                                        }
                                                      },
                                                      {
                                                        "AlarmButton": {
                                                          "content": "true"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "StaircaseEquipment": {
                                                    "version": "0",
                                                    "id": "diid:02b2be0f-c1da-1eef-a490-e019525977ae",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-e019525977ae"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "westl. Treppe zum Westtunnel Gl. 2/3"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10380963"
                                                        }
                                                      },
                                                      {
                                                        "SafeForGuideDog": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "StepColourContrast": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "StepCondition": {
                                                          "content": "even"
                                                        }
                                                      },
                                                      {
                                                        "TactileWriting": {
                                                          "content": "false"
                                                        }
                                                      },
                                                      {
                                                        "TopEnd": {}
                                                      },
                                                      {
                                                        "BottomEnd": {}
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "StaircaseEquipment": {
                                                    "version": "0",
                                                    "id": "diid:02b2be0f-c1da-1eef-a490-e019524df7ae",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-e019524df7ae"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Treppe Bstg. 1/Westtunnel"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10380954"
                                                        }
                                                      },
                                                      {
                                                        "SafeForGuideDog": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "StepColourContrast": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "StepCondition": {
                                                          "content": "even"
                                                        }
                                                      },
                                                      {
                                                        "TactileWriting": {
                                                          "content": "false"
                                                        }
                                                      },
                                                      {
                                                        "TopEnd": {}
                                                      },
                                                      {
                                                        "BottomEnd": {}
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "PassengerInformationEquipment": {
                                                    "version": "0",
                                                    "id": "diid:02aeed9c-f8a3-1fd1-848e-e3cdd3e20000",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02aeed9c-f8a3-1fd1-848e-e3cdd3e20000"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "ZIM 2-1"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10977602"
                                                        }
                                                      },
                                                      {
                                                        "Fixed": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "PassengerInformationEquipmentList": {
                                                          "content": "realTimeDepartures realTimeDisruptions networkStatus"
                                                        }
                                                      },
                                                      {
                                                        "TypeOfPassengerInformationEquipmentRef": {
                                                          "ref": "epd:eu:TypeOfPassengerInformationEquipment:DepMon",
                                                          "version": "any"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "PassengerInformationEquipment": {
                                                    "version": "0",
                                                    "id": "diid:02b2be0f-c1da-1eef-a490-ce37aef2f7ae",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-ce37aef2f7ae"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Gleis 9 Verstärker 36 T-LSPe w"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10587272"
                                                        }
                                                      },
                                                      {
                                                        "Fixed": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "PassengerInformationEquipmentList": {
                                                          "content": "realTimeDepartures realTimeDisruptions networkStatus"
                                                        }
                                                      },
                                                      {
                                                        "TypeOfPassengerInformationEquipmentRef": {
                                                          "ref": "dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements",
                                                          "version": "any"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "PassengerInformationEquipment": {
                                                    "version": "0",
                                                    "id": "diid:02b2be0f-c1da-1eef-a490-ce37aef397ae",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-ce37aef397ae"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Gleis 11 Verstärker 41 T-LSPe"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "10587277"
                                                        }
                                                      },
                                                      {
                                                        "Fixed": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "PassengerInformationEquipmentList": {
                                                          "content": "realTimeDepartures realTimeDisruptions networkStatus"
                                                        }
                                                      },
                                                      {
                                                        "TypeOfPassengerInformationEquipmentRef": {
                                                          "ref": "dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements",
                                                          "version": "any"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "localServices": {
                                              "children": [
                                                {
                                                  "AssistanceService": {
                                                    "version": "0",
                                                    "id": "diid:7ab96572-3590-448a-a880-b8e64065c345",
                                                    "children": [
                                                      {
                                                        "validityConditions": {
                                                          "children": [
                                                            {
                                                              "AvailabilityCondition": {
                                                                "version": "any",
                                                                "id": "dbinfrago-temporary:20803ffd-c1b6-4054-9e3d-7e190281f53a",
                                                                "children": [
                                                                  {
                                                                    "dayTypes": {
                                                                      "children": [
                                                                        {
                                                                          "DayType": {
                                                                            "version": "any",
                                                                            "id": "dbinfrago-temporary:29a02357-4da8-40a3-8565-4e65e60626f6",
                                                                            "children": [
                                                                              {
                                                                                "Name": {
                                                                                  "lang": "de",
                                                                                  "content": "Mo-Su 06:00-22:30"
                                                                                }
                                                                              },
                                                                              {
                                                                                "properties": {
                                                                                  "children": [
                                                                                    {
                                                                                      "PropertyOfDay": {
                                                                                        "children": [
                                                                                          {
                                                                                            "DaysOfWeek": {
                                                                                              "content": "Monday Tuesday Wednesday Thursday Friday Saturday Sunday"
                                                                                            }
                                                                                          }
                                                                                        ]
                                                                                      }
                                                                                    }
                                                                                  ]
                                                                                }
                                                                              },
                                                                              {
                                                                                "timebands": {
                                                                                  "children": [
                                                                                    {
                                                                                      "Timeband": {
                                                                                        "version": "any",
                                                                                        "id": "dbinfrago-temporary:d0a153a5-2b0c-4345-98d7-28a872f7e5d9",
                                                                                        "children": [
                                                                                          {
                                                                                            "StartTime": {
                                                                                              "content": "06:00:00"
                                                                                            }
                                                                                          },
                                                                                          {
                                                                                            "EndTime": {
                                                                                              "content": "22:30:00"
                                                                                            }
                                                                                          }
                                                                                        ]
                                                                                      }
                                                                                    }
                                                                                  ]
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        },
                                                                        {
                                                                          "DayType": {
                                                                            "version": "any",
                                                                            "id": "dbinfrago-temporary:47970131-a4aa-462c-9aff-7c0a066df408",
                                                                            "children": [
                                                                              {
                                                                                "Name": {
                                                                                  "lang": "de",
                                                                                  "content": "PH 06:00-22:30"
                                                                                }
                                                                              },
                                                                              {
                                                                                "properties": {
                                                                                  "children": [
                                                                                    {
                                                                                      "PropertyOfDay": {
                                                                                        "children": [
                                                                                          {
                                                                                            "HolidayTypes": {
                                                                                              "content": "NationalHoliday RegionalHoliday LocalHoliday"
                                                                                            }
                                                                                          }
                                                                                        ]
                                                                                      }
                                                                                    }
                                                                                  ]
                                                                                }
                                                                              },
                                                                              {
                                                                                "timebands": {
                                                                                  "children": [
                                                                                    {
                                                                                      "Timeband": {
                                                                                        "version": "any",
                                                                                        "id": "dbinfrago-temporary:676567b2-c3ec-43ba-9ae8-8958bbc4bccf",
                                                                                        "children": [
                                                                                          {
                                                                                            "StartTime": {
                                                                                              "content": "06:00:00"
                                                                                            }
                                                                                          },
                                                                                          {
                                                                                            "EndTime": {
                                                                                              "content": "22:30:00"
                                                                                            }
                                                                                          }
                                                                                        ]
                                                                                      }
                                                                                    }
                                                                                  ]
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/7ab96572-3590-448a-a880-b8e64065c345"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Mobilitätsservice"
                                                        }
                                                      },
                                                      {
                                                        "infoLinks": {
                                                          "children": [
                                                            {
                                                              "InfoLink": {
                                                                "content": "https://www.bahnhof.de/service/mobilitaetsservice"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "AssistanceFacilityList": {
                                                          "content": "boardingAssistance wheelchairAssistance"
                                                        }
                                                      },
                                                      {
                                                        "AssistanceAvailability": {
                                                          "content": "availableIfBooked"
                                                        }
                                                      },
                                                      {
                                                        "Staffing": {
                                                          "content": "partTime"
                                                        }
                                                      },
                                                      {
                                                        "Languages": {
                                                          "content": "de-DE"
                                                        }
                                                      },
                                                      {
                                                        "AccessibilityTrainedStaff": {
                                                          "content": "true"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "TransportMode": {
                                              "content": "rail"
                                            }
                                          },
                                          {
                                            "StopPlaceType": {
                                              "content": "railStation"
                                            }
                                          },
                                          {
                                            "unlocalisedEquipments": {
                                              "children": [
                                                {
                                                  "SanitaryEquipment": {
                                                    "version": "0",
                                                    "id": "diid:7f1fa761-40a6-45f5-b7f0-333203f1aa1d",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/7f1fa761-40a6-45f5-b7f0-333203f1aa1d"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Toilette behindertengerecht"
                                                        }
                                                      },
                                                      {
                                                        "SanitaryFacilityList": {
                                                          "content": "wheelchairAccessToilet"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "SanitaryEquipment": {
                                                    "version": "0",
                                                    "id": "diid:f12b5f0f-08b6-4174-bbc1-f7f38575e69f",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/f12b5f0f-08b6-4174-bbc1-f7f38575e69f"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Toilette"
                                                        }
                                                      },
                                                      {
                                                        "Description": {
                                                          "lang": "de",
                                                          "content": "im Osttunnel"
                                                        }
                                                      },
                                                      {
                                                        "SanitaryFacilityList": {
                                                          "content": "toilet"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "quays": {
                                              "children": [
                                                {
                                                  "Quay": {
                                                    "version": "1777686780",
                                                    "id": "dbinfrago-temporary:02b2be0f-c1da-1eef-a490-f69996bb57b1",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://daten.bahnhof.de/namespace/dbinfrago-temporary/02b2be0f-c1da-1eef-a490-f69996bb57b1"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Bahnsteig B / Gleis 2/3"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "00530-01-B02"
                                                        }
                                                      },
                                                      {
                                                        "AccessibilityAssessment": {
                                                          "version": "0",
                                                          "id": "dbinfrago:2f46298b-43fe-54b8-9469-599020cb17f2",
                                                          "children": [
                                                            {
                                                              "MobilityImpairedAccess": {
                                                                "content": "false"
                                                              }
                                                            },
                                                            {
                                                              "limitations": {
                                                                "children": [
                                                                  {
                                                                    "AccessibilityLimitation": {
                                                                      "id": "dbinfrago:9dfd2e13-9505-53a7-b5d1-a15d94cdc935",
                                                                      "children": [
                                                                        {
                                                                          "WheelchairAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "StepFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "StairFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "EscalatorFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "LiftFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "RampFreeAccess": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "LevelAccessIntoVehicle": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "AudibleSignalsAvailable": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "VisualSignsAvailable": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "TactileGuidanceAvailable": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "GuideDogAccess": {
                                                                            "content": "true"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "PublicUse": {
                                                          "content": "all"
                                                        }
                                                      },
                                                      {
                                                        "Covered": {
                                                          "content": "unknown"
                                                        }
                                                      },
                                                      {
                                                        "Gated": {
                                                          "content": "openArea"
                                                        }
                                                      },
                                                      {
                                                        "Lighting": {
                                                          "content": "wellLit"
                                                        }
                                                      },
                                                      {
                                                        "SiteRef": {
                                                          "ref": "dhid:de:11000:900120005:EdB"
                                                        }
                                                      },
                                                      {
                                                        "equipmentPlaces": {
                                                          "children": [
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:6255e553-1efb-586f-bc56-553715dbde22",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/6255e553-1efb-586f-bc56-553715dbde22"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "StaircaseEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-e019525977ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:02fc405b-3d05-5631-ae15-f37f8c6ed0d0",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/02fc405b-3d05-5631-ae15-f37f8c6ed0d0"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aec8d7ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:33713984-8002-5085-a6a2-453438b82a9e",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/33713984-8002-5085-a6a2-453438b82a9e"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02aeed9c-f8a3-1fd1-848f-6bdfbc190000"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "TransportMode": {
                                                          "content": "rail"
                                                        }
                                                      },
                                                      {
                                                        "BoardingUse": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "AlightingUse": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "QuayType": {
                                                          "content": "railIslandPlatform"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "Quay": {
                                                    "version": "1777686780",
                                                    "id": "dbinfrago-temporary:02b2be0f-c1da-1eef-a490-e84b6a71d7af",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://daten.bahnhof.de/namespace/dbinfrago-temporary/02b2be0f-c1da-1eef-a490-e84b6a71d7af"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "S-Bahnsteig 01 Gleis 8/9"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "00530-01-SB1"
                                                        }
                                                      },
                                                      {
                                                        "AccessibilityAssessment": {
                                                          "version": "0",
                                                          "id": "dbinfrago:8826d191-71d1-566c-8daf-c590cfd3bbe8",
                                                          "children": [
                                                            {
                                                              "MobilityImpairedAccess": {
                                                                "content": "false"
                                                              }
                                                            },
                                                            {
                                                              "limitations": {
                                                                "children": [
                                                                  {
                                                                    "AccessibilityLimitation": {
                                                                      "id": "dbinfrago:3cc2a65d-34df-5779-99ca-873b6f274bdd",
                                                                      "children": [
                                                                        {
                                                                          "WheelchairAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "StepFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "StairFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "EscalatorFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "LiftFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "RampFreeAccess": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "LevelAccessIntoVehicle": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "AudibleSignalsAvailable": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "VisualSignsAvailable": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "TactileGuidanceAvailable": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "GuideDogAccess": {
                                                                            "content": "true"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "PublicUse": {
                                                          "content": "all"
                                                        }
                                                      },
                                                      {
                                                        "Covered": {
                                                          "content": "unknown"
                                                        }
                                                      },
                                                      {
                                                        "Gated": {
                                                          "content": "openArea"
                                                        }
                                                      },
                                                      {
                                                        "Lighting": {
                                                          "content": "wellLit"
                                                        }
                                                      },
                                                      {
                                                        "SiteRef": {
                                                          "ref": "dhid:de:11000:900120005:EdB"
                                                        }
                                                      },
                                                      {
                                                        "equipmentPlaces": {
                                                          "children": [
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:b115c718-aa1b-5e1b-ac64-1ef8e6e1c953",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/b115c718-aa1b-5e1b-ac64-1ef8e6e1c953"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aef2f7ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:e4eb1cd0-2a6a-5f84-b4b8-c6311389fd3b",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/e4eb1cd0-2a6a-5f84-b4b8-c6311389fd3b"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1fd0-95e0-24d64a591513"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:9e932f4a-4044-58af-994a-c644485ff740",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/9e932f4a-4044-58af-994a-c644485ff740"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a5a2-b522b8eaf7ef"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:4612c0d4-a002-5475-8999-7809ac828176",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/4612c0d4-a002-5475-8999-7809ac828176"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a5a2-b522b8eb57ef"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:930d0dd9-85f3-5f8e-9173-ceb9bc458e65",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/930d0dd9-85f3-5f8e-9173-ceb9bc458e65"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "StaircaseEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-9b87aa75d7ac"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:61f68fd4-c4f4-573c-a01b-138f6eca4c8f",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/61f68fd4-c4f4-573c-a01b-138f6eca4c8f"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aef2b7ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:b9e8360d-8078-580c-9ad5-5ce6c37fa9d9",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/b9e8360d-8078-580c-9ad5-5ce6c37fa9d9"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "StaircaseEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-9f6d8b64f7ac"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:11294487-2e78-5b58-b5ce-1000ec3b2dbd",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/11294487-2e78-5b58-b5ce-1000ec3b2dbd"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aeed97ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:3d51789a-7b10-5442-9810-16f3fa8a6404",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/3d51789a-7b10-5442-9810-16f3fa8a6404"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aed257ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:a2691a56-479f-5cab-b12a-3a022a51010b",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/a2691a56-479f-5cab-b12a-3a022a51010b"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "StaircaseEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-9b87aa75f7ac"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:32358d52-b685-55ff-86a8-9db435c1b0d9",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/32358d52-b685-55ff-86a8-9db435c1b0d9"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aeb6f7ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:8976e29f-7de3-5ec3-95dd-4048196716d5",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/8976e29f-7de3-5ec3-95dd-4048196716d5"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1fd0-95e0-24fd65ba1513"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:84991cb0-4456-50b3-89cf-0de7713399a2",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/84991cb0-4456-50b3-89cf-0de7713399a2"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aef297ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:a010c302-cd12-53c7-b4d9-5749d355d85b",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/a010c302-cd12-53c7-b4d9-5749d355d85b"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a5a2-b522b8eb77ef"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:9a45a977-c6a4-580d-87cb-d32c44a06bce",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/9a45a977-c6a4-580d-87cb-d32c44a06bce"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1fd0-95e0-248a44c93513"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:7e53b41c-1afd-589b-a62f-b4320923f983",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/7e53b41c-1afd-589b-a62f-b4320923f983"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "StaircaseEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-9f6d8b64d7ac"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:04705d05-aba2-55f9-9e61-b77287e04ea6",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/04705d05-aba2-55f9-9e61-b77287e04ea6"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a5a2-b522b8ead7ef"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:b1c28310-c63b-573a-885b-7e59ad3e75b5",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/b1c28310-c63b-573a-885b-7e59ad3e75b5"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "Centroid": {
                                                                      "children": [
                                                                        {
                                                                          "Location": {
                                                                            "children": [
                                                                              {
                                                                                "Longitude": {
                                                                                  "content": "13.43606"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Latitude": {
                                                                                  "content": "52.5102679"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "LiftEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-9ce5083437ac"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:b800854a-44ad-5ff7-9506-5442b8fc7a18",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/b800854a-44ad-5ff7-9506-5442b8fc7a18"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aef2d7ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:38b8a41f-56e5-589e-ac3b-1b5e58bd6a18",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/38b8a41f-56e5-589e-ac3b-1b5e58bd6a18"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-ce37aef277ae"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:7c8e77a7-6cb8-5137-99bc-71619a06916c",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/7c8e77a7-6cb8-5137-99bc-71619a06916c"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "StaircaseEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1eef-a490-9f6d8b6517ac"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "EquipmentPlace": {
                                                                "version": "0",
                                                                "id": "diid:f6a32f7e-dc96-5cd0-9ed4-70ce12a4afb5",
                                                                "children": [
                                                                  {
                                                                    "keyList": {
                                                                      "children": [
                                                                        {
                                                                          "KeyValue": {
                                                                            "children": [
                                                                              {
                                                                                "Key": {
                                                                                  "content": "NORMALIZED_ID_URI"
                                                                                }
                                                                              },
                                                                              {
                                                                                "Value": {
                                                                                  "content": "https://id.vdv.de/diid/f6a32f7e-dc96-5cd0-9ed4-70ce12a4afb5"
                                                                                }
                                                                              }
                                                                            ]
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  },
                                                                  {
                                                                    "PublicUse": {
                                                                      "content": "all"
                                                                    }
                                                                  },
                                                                  {
                                                                    "placeEquipments": {
                                                                      "children": [
                                                                        {
                                                                          "PassengerInformationEquipmentRef": {
                                                                            "ref": "diid:02b2be0f-c1da-1fd0-95e0-245f48b41513"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "TransportMode": {
                                                          "content": "rail"
                                                        }
                                                      },
                                                      {
                                                        "BoardingUse": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "AlightingUse": {
                                                          "content": "true"
                                                        }
                                                      },
                                                      {
                                                        "QuayType": {
                                                          "content": "railIslandPlatform"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "accessSpaces": {
                                              "children": [
                                                {
                                                  "AccessSpace": {
                                                    "version": "0",
                                                    "id": "diid:02b2be0f-c1da-1eef-a490-f7a4a2be37b2",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://id.vdv.de/diid/02b2be0f-c1da-1eef-a490-f7a4a2be37b2"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "EQ-ID"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "10812952"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            },
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "TP-ID"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "00530-04"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Empfangsgebäude / Bauteil 3"
                                                        }
                                                      },
                                                      {
                                                        "PrivateCode": {
                                                          "content": "00530-04"
                                                        }
                                                      },
                                                      {
                                                        "AccessibilityAssessment": {
                                                          "version": "0",
                                                          "id": "dbinfrago:66e16a81-c9d2-51b1-b18b-193466b20061",
                                                          "children": [
                                                            {
                                                              "MobilityImpairedAccess": {
                                                                "content": "false"
                                                              }
                                                            },
                                                            {
                                                              "limitations": {
                                                                "children": [
                                                                  {
                                                                    "AccessibilityLimitation": {
                                                                      "id": "dbinfrago:43cfdac7-6cab-5b19-a75c-6c47f63d684e",
                                                                      "children": [
                                                                        {
                                                                          "WheelchairAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "StepFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "StairFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "EscalatorFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "LiftFreeAccess": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "RampFreeAccess": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "LevelAccessIntoVehicle": {
                                                                            "content": "false"
                                                                          }
                                                                        },
                                                                        {
                                                                          "AudibleSignalsAvailable": {
                                                                            "content": "false"
                                                                          }
                                                                        },
                                                                        {
                                                                          "VisualSignsAvailable": {
                                                                            "content": "true"
                                                                          }
                                                                        },
                                                                        {
                                                                          "TactileGuidanceAvailable": {
                                                                            "content": "unknown"
                                                                          }
                                                                        },
                                                                        {
                                                                          "GuideDogAccess": {
                                                                            "content": "true"
                                                                          }
                                                                        }
                                                                      ]
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "PublicUse": {
                                                          "content": "all"
                                                        }
                                                      },
                                                      {
                                                        "Covered": {
                                                          "content": "indoors"
                                                        }
                                                      },
                                                      {
                                                        "Gated": {
                                                          "content": "openArea"
                                                        }
                                                      },
                                                      {
                                                        "Lighting": {
                                                          "content": "wellLit"
                                                        }
                                                      },
                                                      {
                                                        "SiteRef": {
                                                          "ref": "dhid:de:11000:900120005:EdB"
                                                        }
                                                      },
                                                      {
                                                        "AccessSpaceType": {
                                                          "content": "concourse"
                                                        }
                                                      },
                                                      {
                                                        "PassageType": {
                                                          "content": "other"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "pathLinks": {
                                              "children": [
                                                {
                                                  "SitePathLink": {
                                                    "version": "0",
                                                    "id": "dbinfrago:780fec8d-d080-5670-9322-ba42cf5a01b7",
                                                    "children": [
                                                      {
                                                        "keyList": {
                                                          "children": [
                                                            {
                                                              "KeyValue": {
                                                                "children": [
                                                                  {
                                                                    "Key": {
                                                                      "content": "NORMALIZED_ID_URI"
                                                                    }
                                                                  },
                                                                  {
                                                                    "Value": {
                                                                      "content": "https://daten.bahnhof.de/namespace/dbinfrago/780fec8d-d080-5670-9322-ba42cf5a01b7"
                                                                    }
                                                                  }
                                                                ]
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Treppe Bstg. 1/Westtunnel ↔ Bahnsteig A / Gleis 1"
                                                        }
                                                      },
                                                      {
                                                        "From": {
                                                          "children": [
                                                            {
                                                              "PlaceRef": {
                                                                "ref": "diid:7e16f68f-a873-5f1f-b8ca-9f54a9c828b2"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "To": {
                                                          "children": [
                                                            {
                                                              "PlaceRef": {
                                                                "ref": "dbinfrago-temporary:02b2be0f-c1da-1eef-a490-f69996bb37b1"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      },
                                                      {
                                                        "PublicUse": {
                                                          "content": "all"
                                                        }
                                                      },
                                                      {
                                                        "AllowedUse": {
                                                          "content": "twoWay"
                                                        }
                                                      },
                                                      {
                                                        "SiteRef": {
                                                          "ref": "dhid:de:11000:900120005:EdB"
                                                        }
                                                      },
                                                      {
                                                        "placeEquipments": {
                                                          "children": [
                                                            {
                                                              "StaircaseEquipmentRef": {
                                                                "ref": "diid:02b2be0f-c1da-1eef-a490-e019524df7ae"
                                                              }
                                                            }
                                                          ]
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        },
                        {
                          "ResourceFrame": {
                            "version": "0",
                            "id": "epd:de:DB:ResourceFrame:EU_PI_COMMON:DB",
                            "children": [
                              {
                                "keyList": {
                                  "children": [
                                    {
                                      "KeyValue": {
                                        "children": [
                                          {
                                            "Key": {
                                              "content": "NORMALIZED_ID_URI"
                                            }
                                          },
                                          {
                                            "Value": {
                                              "content": "http://netex-cen.eu/epip_data/de%3ADB%3ASiteFrame%3AEU_PI_COMMON%3ADB"
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                "TypeOfFrameRef": {
                                  "ref": "epip:EU_PI_COMMON",
                                  "versionRef": "1.0"
                                }
                              },
                              {
                                "responsibilitySets": {
                                  "children": [
                                    {
                                      "ResponsibilitySet": {
                                        "version": "0",
                                        "id": "dbinfrago:1da13d58-da67-55db-8d92-891d111c7126",
                                        "children": [
                                          {
                                            "keyList": {
                                              "children": [
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "NORMALIZED_ID_URI"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "https://daten.bahnhof.de/namespace/dbinfrago/1da13d58-da67-55db-8d92-891d111c7126"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "Name": {
                                              "lang": "de",
                                              "content": "Bahnhofsmanagement Saarbrücken"
                                            }
                                          },
                                          {
                                            "roles": {
                                              "children": [
                                                {
                                                  "ResponsibilityRoleAssignment": {
                                                    "version": "0",
                                                    "status": "active",
                                                    "id": "dbinfrago:14fe4ff7-2d62-5d88-88ed-6d9ae254e232",
                                                    "children": [
                                                      {
                                                        "ResponsibilitySetRef": {
                                                          "ref": "dbinfrago:1da13d58-da67-55db-8d92-891d111c7126"
                                                        }
                                                      },
                                                      {
                                                        "Description": {
                                                          "lang": "de",
                                                          "content": "Zuständigkeit Bahnhofsmanagement Auersmacher"
                                                        }
                                                      },
                                                      {
                                                        "DataRoleType": {
                                                          "content": "aggregates"
                                                        }
                                                      },
                                                      {
                                                        "StakeholderRoleType": {
                                                          "content": "Operation"
                                                        }
                                                      },
                                                      {
                                                        "ResponsibleOrganisationRef": {
                                                          "ref": "dbinfrago:3bed9dbc-0878-51b1-ab57-8f7f9c821c78"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "ResponsibilityRoleAssignment": {
                                                    "version": "0",
                                                    "id": "dbinfrago:7ed3786b-ae66-5ebb-8817-7b7938be7278",
                                                    "children": [
                                                      {
                                                        "ResponsibilitySetRef": {
                                                          "ref": "dbinfrago:1da13d58-da67-55db-8d92-891d111c7126"
                                                        }
                                                      },
                                                      {
                                                        "Description": {
                                                          "lang": "de",
                                                          "content": "Zuständigkeit Bahnhofsmanagement Auersmacher"
                                                        }
                                                      },
                                                      {
                                                        "DataRoleType": {
                                                          "content": "creates"
                                                        }
                                                      },
                                                      {
                                                        "StakeholderRoleType": {}
                                                      },
                                                      {
                                                        "ResponsiblePartRef": {
                                                          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                                                          "xsi:type": "OrganisationalUnitRefStructure",
                                                          "ref": "dbinfrago:204b56aa-b8ff-5a07-b64b-5964aeb415f9"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                "typesOfValue": {
                                  "children": [
                                    {
                                      "ValueSet": {
                                        "version": "any",
                                        "id": "quays",
                                        "children": [
                                          {
                                            "Name": {
                                              "lang": "de",
                                              "content": "Ausprägungstypen von Quays"
                                            }
                                          },
                                          {
                                            "values": {
                                              "children": [
                                                {
                                                  "TypeOfPlace": {
                                                    "version": "any",
                                                    "id": "quay:platformHeight",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Höhe einer Bahnsteigkante"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPlace": {
                                                    "version": "any",
                                                    "id": "quay:section",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Gleisabschnitt z.B. Gleis 1 B"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPlace": {
                                                    "version": "any",
                                                    "id": "quay:maxLengthTrain",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Gleisbezogene Bahnsteignutzlänge"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      "ValueSet": {
                                        "version": "any",
                                        "id": "epd:eu:ValueSet:PassengerInformationEquipments",
                                        "children": [
                                          {
                                            "Name": {
                                              "lang": "de",
                                              "content": "Ausprägungstypen von PassengerInformationEquipments"
                                            }
                                          },
                                          {
                                            "values": {
                                              "children": [
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "epd:eu:TypeOfPassengerInformationEquipment:DepMon",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Departure Monitor"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "epd:eu:TypeOfPassengerInformationEquipment:NextStopDisplay",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Next Stop Display"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "epd:eu:TypeOfPassengerInformationEquipment:NextStopAnnouncement",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Next Stop Announcement"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "epd:eu:TypeOfPassengerInformationEquipment:OnBoardInfo",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "On Board Information System"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "epd:eu:TypeOfPassengerInformationEquipment:InfoTerminal",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Self Service Information Terminal"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                },
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "epd:eu:TypeOfPassengerInformationEquipment:HelpDesk",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Help Desk"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    },
                                    {
                                      "ValueSet": {
                                        "version": "any",
                                        "id": "dbinfrago:eu:ValueSet:PassengerInformationEquipments",
                                        "children": [
                                          {
                                            "Name": {
                                              "lang": "de",
                                              "content": "Ausprägungstypen von PassengerInformationEquipments"
                                            }
                                          },
                                          {
                                            "values": {
                                              "children": [
                                                {
                                                  "TypeOfPassengerInformationEquipment": {
                                                    "version": "any",
                                                    "id": "dbinfrago:eu:TypeOfPassengerInformationEquipment:DepAnnouncements",
                                                    "children": [
                                                      {
                                                        "Name": {
                                                          "lang": "de",
                                                          "content": "Departure Announcements (Audio)"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                "organisations": {
                                  "children": [
                                    {
                                      "Operator": {
                                        "version": "0",
                                        "id": "dbinfrago:3bed9dbc-0878-51b1-ab57-8f7f9c821c78",
                                        "children": [
                                          {
                                            "keyList": {
                                              "children": [
                                                {
                                                  "KeyValue": {
                                                    "children": [
                                                      {
                                                        "Key": {
                                                          "content": "NORMALIZED_ID_URI"
                                                        }
                                                      },
                                                      {
                                                        "Value": {
                                                          "content": "https://daten.bahnhof.de/namespace/dbinfrago/3bed9dbc-0878-51b1-ab57-8f7f9c821c78"
                                                        }
                                                      }
                                                    ]
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "VATNumber": {
                                              "content": "DE199861757"
                                            }
                                          },
                                          {
                                            "Name": {
                                              "content": "DB InfraGO AG"
                                            }
                                          },
                                          {
                                            "ShortName": {
                                              "content": "DB InfraGO AG"
                                            }
                                          },
                                          {
                                            "ContactDetails": {
                                              "children": [
                                                {
                                                  "Email": {
                                                    "content": "feedback+openstation@bahnhof.de"
                                                  }
                                                },
                                                {
                                                  "FurtherDetails": {
                                                    "lang": "de",
                                                    "content": "Beachten Sie den Datenschutzhinweis zur Kontaktaufnahme unter https://bahnhof.de/datenschutz"
                                                  }
                                                }
                                              ]
                                            }
                                          },
                                          {
                                            "OrganisationType": {
                                              "content": "facilityOperator"
                                            }
                                          }
                                        ]
                                      }
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
export const SAMPLE_NETEX = data;