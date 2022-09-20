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
exports.checkIfUsernameOrEmailAlreadyExists = exports.selectUserByRoleAndReturn = exports.formatRatingResponse = exports.formatShippingBody = exports.formatTrackingBody = exports.makeTrackRequest = exports.formatRatingBody = void 0;
const axios_1 = __importDefault(require("axios"));
const model_1 = __importDefault(require("../modules/auth/model"));
const formatRatingBody = (body, schema) => {
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
    const redpackSchema = [
        {
            deliveryType: {
                id: 0,
            },
            destination: {
                zipCodeDestination: body.destinyPostalCode,
            },
            origin: {
                zipCodeOrigin: body.originPostalCode,
            },
            parcel: [
                {
                    high: body.packageSize.height,
                    length: body.packageSize.length,
                    piece: 0,
                    weigth: body.packageSize.weight,
                    width: body.packageSize.width,
                },
            ],
            quotationType: 0,
            shippingType: {
                id: 0,
            },
        },
    ];
    const schemas = {
        fedex: fedexSchema,
        dhl: dhlSchema,
        ups: upsSchema,
        redpack: redpackSchema,
    };
    return schemas[schema];
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
const formatTrackingBody = (trackingNumber) => {
    const fedexFormat = {
        includeDetailedScans: true,
        trackingInfo: [
            {
                trackingNumberInfo: {
                    trackingNumber: trackingNumber.toString(),
                },
            },
        ],
    };
    return fedexFormat;
};
exports.formatTrackingBody = formatTrackingBody;
const formatShippingBody = (data) => {
    const { receiverFullName, receiverCompanyName, receiverCountry, receiverPostalCode, receiverCellphone, receiverEmail, receiverAddress, receiverAddress2, receiverAddress3, receiverCity, receiverCounty, shipperFullName, shipperCompanyName, shipperCountry, shipperPostalCode, shipperCellphone, shipperEmail, shipperAddress, shipperAddress2, shipperAddress3, shipperCity, shipperCounty, packageSize, } = data;
    console.log(packageSize);
    const dhlSchema = {
        productCode: "N",
        plannedShippingDateAndTime: "2022-12-21T10:43:06 GMT-06:00",
        pickup: {
            isRequested: false,
        },
        accounts: [
            {
                number: "980391677",
                typeCode: "shipper",
            },
        ],
        outputImageProperties: {
            imageOptions: [
                {
                    typeCode: "waybillDoc",
                    templateName: "ARCH_8X4",
                    isRequested: true,
                    hideAccountNumber: false,
                    numberOfCopies: 1,
                },
            ],
            splitTransportAndWaybillDocLabels: true,
            allDocumentsInOneImage: true,
            splitDocumentsByPages: true,
            splitInvoiceAndReceipt: true,
        },
        customerDetails: {
            shipperDetails: {
                postalAddress: {
                    cityName: shipperCity,
                    countryCode: "MX",
                    postalCode: shipperPostalCode,
                    addressLine1: shipperAddress,
                },
                contactInformation: {
                    phone: shipperCellphone,
                    companyName: shipperCompanyName,
                    fullName: shipperFullName,
                },
            },
            receiverDetails: {
                postalAddress: {
                    cityName: receiverCity,
                    countryCode: "MX",
                    postalCode: receiverPostalCode,
                    addressLine1: receiverAddress,
                    countyName: receiverCounty,
                },
                contactInformation: {
                    phone: receiverCellphone,
                    companyName: receiverCompanyName,
                    fullName: receiverFullName,
                    email: receiverEmail,
                },
            },
        },
        content: {
            unitOfMeasurement: "metric",
            incoterm: "DAP",
            isCustomsDeclarable: false,
            description: "Teddy Bear",
            packages: [
                {
                    customerReferences: [
                        {
                            value: "100299777",
                        },
                    ],
                    weight: packageSize.weight,
                    dimensions: {
                        length: packageSize.length,
                        width: packageSize.width,
                        height: packageSize.height,
                    },
                },
            ],
            declaredValue: 100,
            declaredValueCurrency: "MXN",
        },
    };
    return dhlSchema;
};
exports.formatShippingBody = formatShippingBody;
const iterateAndLevel = ({ output, products, RateResponse, }) => {
    if (output) {
        const arr = output.rateReplyDetails;
        return arr.map((service) => {
            let price = service.ratedShipmentDetails.map((item) => {
                return {
                    type: item.rateType,
                    prices: item.totalNetFedExCharge,
                };
            });
            let serviceName = service.serviceName;
            return { serviceName: serviceName, price: price, company: "FEDEX" };
        });
    }
    if (products) {
        const arr = products;
        return arr.map((service) => {
            let price = service.totalPrice.find((item) => item.currencyType.includes("PULCL"));
            let serviceName = service.productName;
            return { serviceName: serviceName, price: price.price, company: "DHL" };
        });
    }
    if (RateResponse) {
        const ratedShipment = RateResponse["RatedShipment"];
        const totalPrice = ratedShipment["TotalCharges"];
        return {
            serviceName: "UPS GROUND",
            price: totalPrice["MonetaryValue"],
            company: "UPS",
        };
    }
};
const formatRatingResponse = (responses) => {
    const res = responses.flatMap((data) => iterateAndLevel(data));
    return res;
};
exports.formatRatingResponse = formatRatingResponse;
const selectUserByRoleAndReturn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    /* let model;
    switch (payload.type) {
      case "admin":
        model = new Admins(prisma.admin);
        break;
      case "franchise":
        model = new Franchises(prisma.franchise);
        break;
      case "cashier":
        model = new Cashiers(prisma.cashier);
        break;
      default:
        return new Error("Invalid user type");
    }
    return await model.getUser(payload.id);*/
});
exports.selectUserByRoleAndReturn = selectUserByRoleAndReturn;
const checkIfUsernameOrEmailAlreadyExists = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existsUserWithSameEmail = yield model_1.default.getUser({
            email: userData.email,
        });
        if (existsUserWithSameEmail)
            return true;
        const existsUserWithSameName = yield model_1.default.getUser({
            name: userData.name,
        });
        if (existsUserWithSameName)
            return true;
        return false;
    }
    catch (error) {
        throw error;
    }
});
exports.checkIfUsernameOrEmailAlreadyExists = checkIfUsernameOrEmailAlreadyExists;
