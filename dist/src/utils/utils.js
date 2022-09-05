"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTrackRequest = exports.formatRatingBody = void 0;
const axios_1 = __importDefault(require("axios"));
const formatRatingBody = (body) => {
    const fedexSchema = {
        accountNumber: {
            value: "781802379",
        },
        requestedShipment: {
            shipper: {
                address: {
                    postalCode: body.originPostalCode,
                    countryCode: body.originCountry,
                },
            },
            recipient: {
                address: {
                    postalCode: body.destinyPostalCode,
                    countryCode: body.destinyCountry,
                },
            },
            pickupType: "DROPOFF_AT_FEDEX_LOCATION",
            serviceType: "FEDEX_EXPRESS_SAVER",
            packagingType: "YOUR_PACKAGING",
            rateRequestType: ["LIST", "ACCOUNT"],
            requestedPackageLineItems: [
                {
                    weight: {
                        units: "KG",
                        value: body.packageSize.weight,
                    },
                },
            ],
        },
    };
    const dhlSchema = {
        customerDetails: {
            receiverDetails: {
                postalCode: body.destinyPostalCode.toString(),
                countryCode: body.destinyCountry,
                cityName: "envioshop",
                addressLine1: "envioshop",
            },
            shipperDetails: {
                postalCode: body.originPostalCode.toString(),
                countryCode: body.originCountry,
                cityName: "envioshop",
                addressLine1: "envioshop",
                provinceCode: "MX",
            },
        },
        accounts: [
            {
                typeCode: "shipper",
                number: "980391677",
            },
        ],
        plannedShippingDateAndTime: "2021-11-25T13:00:00GMT+00:00",
        unitOfMeasurement: "metric",
        isCustomsDeclarable: true,
        monetaryAmount: [
            {
                typeCode: "declaredValue",
                value: 10,
                currency: "MXN",
            },
        ],
        requestAllValueAddedServices: false,
        returnStandardProductsOnly: false,
        nextBusinessDay: false,
        packages: [
            {
                weight: 1,
                dimensions: {
                    width: body.packageSize.width,
                    height: body.packageSize.height,
                    length: body.packageSize.length,
                },
            },
        ],
    };
    const upsSchema = {
        RateRequest: {
            Request: {
                SubVersion: "1703",
                TransactionReference: {
                    CustomerContext: " ",
                },
            },
            Shipment: {
                ShipmentRatingOptions: {
                    UserLevelDiscountIndicator: "TRUE",
                },
                Shipper: {
                    Name: "envioshop",
                    ShipperNumber: " ",
                    Address: {
                        PostalCode: body.originPostalCode.toString(),
                        CountryCode: body.originCountry,
                    },
                },
                ShipTo: {
                    Name: "envisohop",
                    Address: {
                        PostalCode: body.destinyPostalCode.toString(),
                        CountryCode: body.destinyCountry,
                    },
                },
                ShipFrom: {
                    Name: "envioshop",
                    Address: {
                        PostalCode: body.originPostalCode.toString(),
                        CountryCode: body.originCountry,
                    },
                },
                Service: {
                    Code: "65",
                },
                ShipmentTotalWeight: {
                    UnitOfMeasurement: {
                        Code: "LBS",
                        Description: "Pounds",
                    },
                    Weight: "10",
                },
                Package: {
                    PackagingType: {
                        Code: "02",
                        Description: "Package",
                    },
                    Dimensions: {
                        UnitOfMeasurement: {
                            Code: "CM",
                        },
                        Length: "10",
                        Width: "7",
                        Height: "5",
                    },
                    PackageWeight: {
                        UnitOfMeasurement: {
                            Code: "KGS",
                        },
                        Weight: "7",
                    },
                },
            },
        },
    };
    return { fedex: fedexSchema, dhl: dhlSchema, ups: upsSchema };
};
exports.formatRatingBody = formatRatingBody;
const makeTrackRequest = ({ url, headers, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (url.includes("fedex")) {
            return;
        }
        let testUrl = url.replace("{shipmentTrackingNumber}", "1234567890");
        const { data, status } = yield (0, axios_1.default)({
            url: testUrl,
            method: "GET",
            headers: Object.assign({}, headers),
        });
        console.log(data);
    }
    catch (error) { }
});
exports.makeTrackRequest = makeTrackRequest;
