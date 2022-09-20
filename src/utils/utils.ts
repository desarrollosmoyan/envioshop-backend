import axios from "axios";
import { JwtPayload } from "jsonwebtoken";
import { createClient } from "redis";
import prisma from "../database/prisma";
import userModel from "../modules/auth/model";

export const formatRatingBody = (body: Rating, schema: string) => {
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

  const schemas: any = {
    fedex: fedexSchema,
    dhl: dhlSchema,
    ups: upsSchema,
    redpack: redpackSchema,
  };
  return schemas[schema as keyof any];
};

export const makeTrackRequest = async ({
  url,
  headers,
}: {
  url: string;
  headers: any;
}) => {
  try {
    if (url.includes("fedex")) {
      return;
    }
    let testUrl = url.replace("{shipmentTrackingNumber}", "1234567890");
    const { data, status } = await axios({
      url: testUrl,
      method: "GET",
      headers: {
        ...headers,
      },
    });
    console.log(data);
  } catch (error) {}
};

export const formatTrackingBody = (trackingNumber: number) => {
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

export const formatShippingBody = (data: any) => {
  const {
    receiverFullName,
    receiverCompanyName,
    receiverCountry,
    receiverPostalCode,
    receiverCellphone,
    receiverEmail,
    receiverAddress,
    receiverAddress2,
    receiverAddress3,
    receiverCity,
    receiverCounty,
    shipperFullName,
    shipperCompanyName,
    shipperCountry,
    shipperPostalCode,
    shipperCellphone,
    shipperEmail,
    shipperAddress,
    shipperAddress2,
    shipperAddress3,
    shipperCity,
    shipperCounty,
    packageSize,
  } = data;
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

const iterateAndLevel = ({
  output,
  products,
  RateResponse,
}: {
  output?: any;
  products?: any;
  RateResponse?: any;
}) => {
  if (output) {
    const arr = output.rateReplyDetails;
    return arr.map((service: any) => {
      let price = service.ratedShipmentDetails.map((item: any) => {
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
    return arr.map((service: any) => {
      let price = service.totalPrice.find((item: any) =>
        item.currencyType.includes("PULCL")
      );
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

export const formatRatingResponse = (responses: any) => {
  const res = responses.flatMap((data: any) => iterateAndLevel(data));
  return res;
};

export const selectUserByRoleAndReturn = async (payload: JwtPayload) => {
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
};

export const checkIfUsernameOrEmailAlreadyExists = async (userData: {
  email: string;
  name: string;
}) => {
  try {
    const existsUserWithSameEmail = await userModel.getUser({
      email: userData.email,
    });
    if (existsUserWithSameEmail) return true;

    const existsUserWithSameName = await userModel.getUser({
      name: userData.name,
    });
    if (existsUserWithSameName) return true;

    return false;
  } catch (error) {
    throw error;
  }
};
