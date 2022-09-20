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
exports.ScrappingService = exports.ApiService = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils/utils");
class Service {
    constructor(serviceData) {
        this.headers = new Headers();
        const { baseUrl, headers, serviceName } = serviceData;
        this.baseUrl = baseUrl;
        this.serviceName = serviceName;
        this.setHeaders(headers);
        if (serviceData.subServices) {
            this.setSubServices(serviceData.subServices);
        }
    }
    setHeaders(headers) {
        const newHeaders = new Headers();
        Object.keys(headers).map((key) => {
            newHeaders.append(key, headers[key]);
        });
        this.headers = newHeaders;
    }
    getHeaders() {
        let headers;
        Object.keys(this.headers).map((key) => {
            headers[key] = this.headers.get(key);
        });
        return headers;
    }
}
class ApiService extends Service {
    constructor(serviceData) {
        super(serviceData);
    }
    setSubServices(subServices) {
        this.subServices = subServices;
    }
    getRating(ratingBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subServices) {
                throw new Error("This service doesn't have subServices");
            }
            const ratingInfo = this.subServices.rating;
            const parsedBodies = (0, utils_1.formatRatingBody)(ratingBody);
            const body = parsedBodies[this.serviceName.toLowerCase()];
            try {
                const { data } = yield (0, axios_1.default)({
                    method: ratingInfo.method,
                    url: `${this.baseUrl}${ratingInfo.url}`,
                    headers: this.getHeaders(),
                    data: body,
                });
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTracking(trackingNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subServices) {
                throw new Error("This service doesn't have subServices");
            }
            const trackingInfo = this.subServices.tracking;
            const isPost = trackingInfo.method === "POST";
            let body;
            if (isPost) {
                body = (0, utils_1.formatTrackingBody)(trackingNumber);
            }
            try {
                const { data } = yield (0, axios_1.default)({
                    method: trackingInfo.method,
                    url: trackingInfo.url,
                    data: body,
                    headers: this.getHeaders(),
                });
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPicking() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((data) => data);
        });
    }
    createShipping() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((data) => data);
        });
    }
}
exports.ApiService = ApiService;
class ScrappingService extends Service {
    constructor(serviceData) {
        super(serviceData);
    }
    setSubServices(subServices) { }
    getRating() {
        return new Promise((data) => data);
    }
    getTracking() {
        return new Promise((data) => data);
    }
    getPicking() {
        return new Promise((data) => data);
    }
    createShipping() {
        return new Promise((data) => data);
    }
}
exports.ScrappingService = ScrappingService;
