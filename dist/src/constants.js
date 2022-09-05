"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPS = exports.DHL = exports.FEDEX = void 0;
exports.FEDEX = {
    baseUrl: "https://apis.fedex.com",
    headers: {
        "Content-Type": "application/json",
    },
    subServices: {
        rating: {
            url: "/rate/v1/rates/quotes",
        },
        tracking: {
            url: "/track/v1/associatedshipments",
        },
        picking: {
            url: "",
        },
        shipping: {
            url: "",
        },
    },
};
exports.DHL = {
    baseUrl: "https://express.api.dhl.com/mydhlapi/test",
    headers: {
        "Content-Type": "application/json",
    },
    subServices: {
        rating: {
            url: "/rates",
        },
        tracking: {
            url: "/shipments/{shipmentTrackingNumber}/tracking",
        },
        picking: {
            url: "",
        },
        shipping: {
            url: "",
        },
    },
    Authorization: `Basic ${Buffer.from(`${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`).toString("base64")}`,
};
exports.UPS = {
    baseUrl: "https://wwwcie.ups.com/ship/v1",
    headers: {
        "Content-Type": "application/json",
        AccessLicenseNumber: `${process.env.ACCESS_LICENSE_NUMBER}`,
    },
    subServices: {
        rating: {
            url: "/rating/Rate",
        },
        tracking: {
            url: "",
        },
        picking: {
            url: "",
        },
        shipping: {
            url: "",
        },
    },
};
