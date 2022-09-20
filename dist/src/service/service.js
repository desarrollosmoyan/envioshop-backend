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
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const qs_1 = __importDefault(require("qs"));
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
class ApiService extends Service {
    constructor(serviceData) {
        super(serviceData);
    }
    setSubServices(subServices) {
        this.subServices = subServices;
    }
    getAuthorization() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.headers["Authorization"];
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
                }
                else if (this.serviceName === "REDPACK") {
                    console.log("entro");
                    const body = qs_1.default.stringify({
                        client_secret: `${process.env.CLIENT_SECRET_REDPACK}`,
                        client_id: `${process.env.CLIENT_ID_REDPACK}`,
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
                        },
                    });
                    console.log("pepe");
                    console.log({ redpack: data });
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
                yield this.setAuthorization();
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
    createShipping(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.subServices) {
                return new Error("This service doesn't have subServices");
            }
            const shippingInfo = this.subServices.shipping;
            const isPost = shippingInfo.method === "POST";
            let body;
            if (isPost) {
                body = (0, utils_1.formatShippingBody)(data);
            }
            try {
                const { data } = yield (0, axios_1.default)({
                    method: shippingInfo.method,
                    url: shippingInfo.url,
                    data: body,
                });
                return data;
            }
            catch (error) {
                throw error;
            }
            return new Promise((data) => data);
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
            this.browser = yield puppeteer_core_1.default.launch({
                executablePath: "/usr/bin/chromium-browser",
            });
            this.page = yield this.browser.newPage();
            yield this.page.goto(this.baseUrl);
            console.log(this.baseUrl);
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
            if (this.page && this.subServices)
                try {
                    let prices = [
                        {
                            serviceName: "Dia Siguiente",
                            price: 0,
                            company: "ESTAFETA",
                        },
                        {
                            serviceName: "2 Dias",
                            price: 0,
                            company: "ESTAFETA",
                        },
                        {
                            serviceName: "Terrestre",
                            price: 0,
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
                    yield this.page.click("#btnEnviarCotiza");
                    yield this.page.screenshot({ path: "./img.png", type: "png" });
                    yield this.page.waitForSelector("#wrapResultados");
                    prices = yield Promise.all(prices.map((price, i) => __awaiter(this, void 0, void 0, function* () {
                        let selector = `div#cost_total_${i}`;
                        if (this.page)
                            price.price = yield this.page.$eval(selector.toString(), (element) => element.textContent);
                        return price;
                    })));
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
