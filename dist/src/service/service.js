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
exports.ScrappingService = exports.ApiService = exports.Service = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils/utils");
const puppeteer_1 = __importDefault(require("puppeteer"));
const qs_1 = __importDefault(require("qs"));
const perf_hooks_1 = require("perf_hooks");
class Service {
    constructor(serviceData) {
        const { baseUrl, headers, serviceName } = serviceData;
        this.baseUrl = baseUrl;
        this.serviceName = serviceName;
        this.setHeaders(headers);
        if (serviceData.subServices) {
            this.setSubServices(serviceData.subServices);
        }
    }
    setHeaders(headers) {
        this.headers = headers;
    }
    getHeaders() {
        return this.headers;
    }
}
exports.Service = Service;
class ApiService extends Service {
    constructor(serviceData) {
        super(serviceData);
    }
    setSubServices(subServices) {
        this.subServices = subServices;
    }
    getAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.auth;
        });
    }
    setAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.serviceName === "FEDEX") {
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
                    this.auth = data;
                }
                else if (this.serviceName === "REDPACK") {
                    console.log("entro");
                    const body = qs_1.default.stringify({
                        grant_type: "password",
                        username: `${process.env.USERNAME_REDPACK}`,
                        password: `${process.env.PASSWORD_REDPACK}`,
                    });
                    const { data } = yield (0, axios_1.default)({
                        method: "POST",
                        data: body,
                        url: `https://api.redpack.com.mx/oauth/token`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID_REDPACK}:${process.env.CLIENT_SECRET_REDPACK}`).toString("base64")}`,
                        },
                    });
                    this.auth = data;
                    this.headers["Authorization"] = `Bearer ${data.access_token}`;
                }
            }
            catch (err) {
                console.log(err.response.data);
            }
        });
    }
    getRating(ratingBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subServices) {
                return new Error("This service doesn't have subServices");
            }
            const ratingInfo = this.subServices.rating;
            const body = (0, utils_1.formatRatingBody)(ratingBody, this.serviceName.toLowerCase());
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
                return error;
            }
        });
    }
    getTracking(trackingNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subServices) {
                return new Error("This service doesn't have subServices");
            }
            const trackingInfo = this.subServices.tracking;
            const isPost = trackingInfo.method === "POST";
            let body;
            const url = `${this.baseUrl}${trackingInfo.url.replace("0", trackingNumber.toString())}`;
            console.log(url);
            if (isPost) {
                body = (0, utils_1.formatTrackingBody)(trackingNumber);
            }
            try {
                const { data } = yield (0, axios_1.default)({
                    method: trackingInfo.method,
                    url: url,
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
    createShipping(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subServices) {
                return new Error("This service doesn't have subServices");
            }
            const shippingInfo = this.subServices.shipping;
            console.log(shippingInfo);
            const isPost = shippingInfo.method === "POST";
            let body;
            if (isPost) {
                body = (0, utils_1.formatShippingBody)(data, this.serviceName);
                console.log(body);
            }
            try {
                const { data } = yield (0, axios_1.default)({
                    method: shippingInfo.method,
                    url: `${this.baseUrl}${shippingInfo.url}`,
                    data: body,
                    headers: this.getHeaders(),
                });
                return data;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.ApiService = ApiService;
class ScrappingService extends Service {
    constructor(serviceData) {
        super(serviceData);
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer_1.default.launch({});
            this.page = yield this.browser.newPage();
            yield this.page.goto(this.baseUrl);
        });
    }
    setSubServices(subServices) {
        this.subServices = subServices;
    }
    setAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Error("This service doesn't require authorization");
        });
    }
    getRating(ratingBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = perf_hooks_1.performance.now();
            if (this.page && this.subServices)
                try {
                    let prices = [
                        {
                            serviceName: "Dia Siguiente",
                            prices: {
                                total: 0,
                                subTotal: 0,
                            },
                            company: "ESTAFETA",
                        },
                        {
                            serviceName: "2 Dias",
                            prices: {
                                total: 0,
                                subTotal: 0,
                            },
                            company: "ESTAFETA",
                        },
                        {
                            serviceName: "Terrestre",
                            prices: {
                                total: 0,
                                subTotal: 0,
                            },
                            company: "ESTAFETA",
                        },
                    ];
                    const url = `${this.baseUrl}${this.subServices.rating.url}`;
                    yield this.page.goto("https://cotizadorsitecorecms.azurewebsites.net/?lang=0");
                    yield this.page.click("#package");
                    yield this.page.type("#zipCodeOri", ratingBody.originPostalCode.toString());
                    yield this.page.type("#zipCodeDes", ratingBody.destinyPostalCode.toString());
                    yield this.page.type("#weightPackage", ratingBody.packageSize.weight.toString());
                    yield this.page.type("#highPackage", ratingBody.packageSize.height.toString());
                    yield this.page.type("#longPackage", ratingBody.packageSize.length.toString());
                    yield this.page.type("#widthPackage", ratingBody.packageSize.width.toString());
                    yield this.page.screenshot({ path: "./img.png", type: "png" });
                    yield this.page.click("#btnEnviarCotiza");
                    yield this.page.screenshot({ path: "./img.png", type: "png" });
                    yield this.page.waitForSelector("#wrapResultados");
                    prices = yield Promise.all(prices.map((price, i) => __awaiter(this, void 0, void 0, function* () {
                        let selector = `div#cost_total_${i}`;
                        if (this.page) {
                            price.prices.total = yield this.page.$eval(selector.toString(), (element) => element.textContent);
                            price.prices.subTotal = yield this.page.$eval(`table tbody tr:nth-child(4) td:nth-child(${i + 3})`, (element) => element.textContent);
                            return price;
                        }
                    })));
                    console.log(prices);
                    return prices;
                }
                catch (error) {
                    return error;
                }
        });
    }
    getTracking(trackingNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page && this.subServices) {
                const url = `${this.baseUrl}${this.subServices.tracking.url}`;
                yield this.page.goto(url);
                yield this.page.type("#GuiaCodigo", trackingNumber.toString());
                yield this.page.click("#btnRastrear");
            }
        });
    }
    getPicking() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Error("This service doesn't have this subService");
        });
    }
    createShipping() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Error("This service doesnt't have this subService");
        });
    }
}
exports.ScrappingService = ScrappingService;
