import axios from "axios";
import { createClient } from "redis";

export const formatRatingBody = (body: Rating) => {
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

