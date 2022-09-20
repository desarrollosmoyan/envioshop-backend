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
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const utils_1 = require("../utils/utils");
class Service {
    constructor(baseUrl, headers, subServices, serviceName) {
        this.subServices = {
            rating: { url: "", method: "" },
            picking: { url: "", method: "" },
            shipping: { url: "", method: "" },
            tracking: { url: "", method: "" },
        };
        this.baseUrl = baseUrl;
        this.headers = headers;
        this.serviceName = serviceName;
        this.subServices = subServices;
        this.setAuthorizationToken();
    }
    getRating(ratingBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedBodies = yield (0, utils_1.formatRatingBody)(ratingBody);
                const body = parsedBodies[this.serviceName.toLowerCase()];
                const { data } = yield (0, axios_1.default)({
                    method: "POST",
                    data: body,
                    headers: Object.assign({}, this.headers),
                    url: `${this.baseUrl}${this.subServices.rating.url}`,
                });
                return data;
            }
            catch (error) {
                return error;
            }
        });
    }
    setAuthorizationToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.serviceName === "Fedex") {
                    const body = qs_1.default.stringify({
                        client_secret: `${process.env.CLIENT_SECRET}`,
                        client_id: `${process.env.CLIENT_ID}`,
                        grant_type: `${process.env.GRANT_TYPE}`,
                    });
                    const { data } = yield (0, axios_1.default)({
                        method: "POST",
                        data: body,
                        url: `${this.baseUrl}/oauth/token`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    });
                    this.headers["Authorization"] = `Bearer ${data.access_token}`;
                }
                else if (this.serviceName === "DHL") {
                    this.headers["Authorization"] = `Basic ${Buffer.from(`${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`).toString("base64")}`;
                }
                else if (this.serviceName === "UPS") {
                    this.headers["AccessLicenseNumber"] = `${process.env.ACCESS_LICENSE_NUMBER}`;
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    getAuthorizationToken() {
        switch (this.serviceName) {
            case "Fedex":
                return `Bearer ${this.token}`;
            case "DHL":
                return `Basic ${this.token}`;
            case "UPS":
                return `${this.token}`;
        }
        return this.token;
    }
    getTracking(trackingNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPost = this.subServices.tracking.method === "POST";
                let body;
                if (isPost) {
                    body = (0, utils_1.formatTrackingBody)(trackingNumber);
                }
                const url = !isPost
                    ? this.subServices.tracking.url.replace("0", "1234567890")
                    : this.subServices.tracking.url;
                console.log(url);
                const response = yield (0, axios_1.default)({
                    method: this.subServices.tracking.method,
                    url: `${this.baseUrl}${url}`,
                    data: isPost ? body : null,
                    headers: Object.assign({}, this.headers),
                });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getShipment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) { }
        });
    }
    setSubServices(subServices) {
        this.subServices = subServices;
    }
    setSubServicesURL(subServicesUrls) {
        Object.keys(this.subServices).map((key) => {
            this.subServices[key].url =
                subServicesUrls[key];
        });
    }
}
exports.default = Service;
