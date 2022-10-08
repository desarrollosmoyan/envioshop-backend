import axios from "axios";
import { JwtPayload } from "jsonwebtoken";
import { createClient } from "redis";
import adminModel from "../database/models/admin.model";
import cashierModel from "../database/models/cashier.model";
import franchiseModel from "../database/models/franchise.model";
import prisma from "../database/prisma";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const models = {
  admin: adminModel,
  franchise: franchiseModel,
  cashier: cashierModel,
};
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
      //STANDARD_OVERNIGHT - Economico - FEDEX_EXPRESS_SAVER,
      rateRequestType: ["ACCOUNT"],
      requestedPackageLineItems: [
        {
          weight: {
            units: "KG",
            value: body.packageSize.weight,
          },
          dimensions: {
            length: body.packageSize.length,
            width: body.packageSize.width,
            height: body.packageSize.height,
            units: "CM",
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
        id: 2,
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
          piece: 1,
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

  const paqueteExpressSceham = {
    header: {
      security: {
        user: "",
        password: "",
        type: 2,
        token: "325746796331582000000",
      },
      device: {
        appName: "RAD",
        type: "Web",
        ip: "",
        idDevice: "",
      },
      target: {
        module: "RAD",
        version: "v1.0",
        service: "rad",
        uri: "rads",
        event: "CRUD",
      },
      output: "JSON",
      language: "ESP",
    },
    body: {
      request: {
        data: {
          clientId: "",
          clientDest: "",
          pymtMode: "",
          clientAddrOrig: {
            colonyName: "",
            zipCode: body.originPostalCode,
            branch: "",
            zone: "",
          },
          clientAddrDest: {
            colonyName: "",
            zipCode: body.destinyPostalCode,
            branch: "",
            zone: "",
          },
          shipmentDetail: {
            shipments: [
              {
                sequence: 0,
                weight: body.packageSize.weight,
                longShip: body.packageSize.length,
                widthShip: body.packageSize.width,
                highShip: body.packageSize.height,
                shpCode: "2",
                quantity: 1,
                srvcId: "SHP-G",
                srvcRefId: "PACKETS",
              },
            ],
          },
          otherServices: {
            otherServices: [],
          },
          quoteServices: ["ALL"],
          dateTime: "2022-09-23 11:22:17",
        },
      },
    },
  };

  const schemas: any = {
    fedex: fedexSchema,
    dhl: dhlSchema,
    ups: upsSchema,
    redpack: redpackSchema,
    paqueteexpress: paqueteExpressSceham,
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

export const formatShippingBody = (data: any, serviceName: string) => {
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
  const dhlSchema = {
    productCode: "N",
    plannedShippingDateAndTime: "2022-09-25T10:43:06 GMT-06:00",
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
          fullName: "Brayan Cardozo",
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
          fullName: "Arturo Artaza",
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
  const fedexSchema = {
    requestedShipment: {
      pickupType: "USE_SCHEDULED_PICKUP",
      serviceType: "STANDARD_OVERNIGHT",
      packagingType: "YOUR_PACKAGING",
      totalWeight: packageSize.weight,
      shipper: {
        address: {
          streetLines: [shipperAddress],
          city: shipperCity,
          stateOrProvinceCode: shipperCounty,
          postalCode: shipperPostalCode,
          countryCode: "MX",
        },
        contact: {
          personName: shipperFullName,
          emailAddress: shipperEmail,
          phoneExtension: "52",
          phoneNumber: shipperCellphone,
          companyName: "ENVIOSHOP",
        },
      },
      recipients: [
        {
          address: {
            streetLines: [receiverAddress],
            city: receiverCity,
            stateOrProvinceCode: receiverCounty,
            postalCode: receiverPostalCode,
            countryCode: "MX",
          },
          contact: {
            personName: "Brayan",
            emailAddress: "sample@company.com",
            phoneExtension: "52",
            phoneNumber: receiverCellphone,
            companyName: "ENVIOSHOP",
          },
        },
      ],
      requestedPackageLineItems: [
        {
          weight: {
            units: "KG",
            value: packageSize.weight,
          },
          dimensions: {
            length: packageSize.length,
            width: packageSize.width,
            height: packageSize.height,
            units: "CM",
          },
          itemDescriptionForClearance: "description",
        },
      ],
    },
    accountNumber: {
      value: "781802379",
    },
    openShipmentAction: "CREATE_PACKAGE",
    index: "Test1234",
  };
  if (serviceName === "FEDEX") return fedexSchema;
  if (serviceName === "DHL") return dhlSchema;
  return dhlSchema;
};

const iterateAndLevel = ({
  output,
  products,
  RateResponse,
  body,
  values,
}: {
  output?: any;
  products?: any;
  RateResponse?: any;
  body?: any;
  values?: any;
}) => {
  if (output) {
    const arr = output.rateReplyDetails;
    return arr.map((service: any) => {
      let price = service.ratedShipmentDetails.map((item: any) => {
        return {
          subTotal: item.totalNetFedExCharge,
          total: item.totalNetCharge,
        };
      });
      let serviceName = service.serviceName;
      return {
        serviceName: serviceName,
        prices: { ...price },
        company: "FEDEX",
      };
    });
  }
  if (products) {
    const arr = products;
    return arr.map((service: any) => {
      let price = service.totalPrice.find((item: any) =>
        item.currencyType.includes("PULCL")
      );
      let serviceName = service.productName;
      return {
        serviceName: serviceName,
        prices: {
          total: (price.price + 44.67).toFixed(2),
          subTotal: price.price,
        },
        company: "DHL",
      };
    });
  }
  if (RateResponse) {
    const ratedShipment = RateResponse["RatedShipment"];
    const totalPrice = ratedShipment["TotalCharges"];
    const subTotal = ratedShipment["BaseServiceCharge"];
    return {
      serviceName: "UPS GROUND",
      prices: {
        total: totalPrice["MonetaryValue"],
        subTotal: subTotal["MonetaryValue"],
      },
      company: "UPS",
    };
  }
  if (body) {
    const data = body.response.data.quotations;
    const arr = data.map((service: any) => {
      return {
        serviceName: service.serviceName,
        prices: {
          total: service.amount.totalAmnt,
          subTotal: service.amount.subTotlAmnt,
        },
        company: "PAQUETE EXPRESS",
      };
    });
    return arr;
  }
  if (values) {
    const arr = values.map((service: any) => {
      return {
        serviceName: service.serviceType["serviceType"],
        prices: {
          total: service.quoteDetail[3],
          subTotal: 200,
        },
        company: "REDPACK",
      };
    });
    return arr;
  }
};

export const formatRatingResponse = (responses: any) => {
  const res = responses
    .flatMap((data: any) =>
      iterateAndLevel(data instanceof Array ? data[0] : data)
    )
    .filter((element: any) => (element !== null ? true : false));
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

export const createUserByType = async (data: any, type: string) => {
  try {
    //const password = await encryptPassword(data.password);
    //data.password = password;
    let user;
    switch (type) {
      case "admin":
        user = await adminModel.create(data);
        break;
      case "franchise":
        user = await franchiseModel.create(data, true);
        break;
      case "cashier":
        user = await cashierModel.create(data, true);
        break;
    }
    if (!user) return null;
    //const token = await generateToken(user.id, user.email, user.password, type);
    return { ...user };
  } catch (error) {
    return error;
  }
};
export const loginUserByType = async (data: {
  email: string;
  password: string;
}) => {
  const { password, email } = data;
  const type = await whichUserTypeIsIt(email);
  console.log(type);
  console.log(password);
  if (type === "none") throw new Error("User not created");
  const user = await models[type as keyof typeof models].get({
    email: data.email,
  });
  if (!user) return null;
  const hash = user.password;
  console.log(user);
  const hasPasswordMatched = await verifyPassword(password, hash);
  if (!hasPasswordMatched) throw new Error("Password incorrect");
  const token = await generateToken(
    user.id,
    user.email,
    user.password,
    user.type
  );
  return { user, token: token };
};

export const whichUserTypeIsIt = async (email: string) => {
  const isAdmin = await adminModel.get({ email: email });
  if (isAdmin) return "admin";
  const isCashier = await cashierModel.get({ email: email });
  if (isCashier) return "cashier";
  const isFranchise = await franchiseModel.get({ email: email });
  if (isFranchise) return "franchise";
  return "none";
};
export const encryptPassword = async (password: string) => {
  //const salt = await genSalt(10);
  return await hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  receivePassword: string
) => {
  return await compare(password, receivePassword);
};

export const generateToken = async (
  id: string,
  email: string,
  password: string,
  type: string
) => {
  return jwt.sign(
    { id: id, email: email, password: password, type: type },
    `${process.env.SECRET_KEY_TOKEN}`
  );
};
