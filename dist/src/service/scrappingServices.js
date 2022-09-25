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
exports.ScrappingService2 = void 0;
const service_1 = require("./service");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
class ScrappingService2 extends service_1.Service {
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
                    yield this.page.goto(this.baseUrl);
                    const buttonAccept = yield this.page.$("button.BtnBlue.px-10.py-2.font-bold");
                    if (buttonAccept) {
                        yield this.page.click("button.BtnBlue.px-10.py-2.font-bold");
                    }
                    yield this.page.click("button.BtnRed.mt-4.px-10.py-4.font-bold.text-2xl.tracking-wide.uppercase");
                    yield this.page.waitForSelector("div.InputPostalCode");
                    yield this.page.click("div.InputPostalCode > div > span");
                    yield this.page.type("#postalcodes-suburb", ratingBody.originPostalCode.toString());
                    yield this.page.waitForSelector("#postalcodes-cities");
                    yield this.page.click("#postalcodes-cities");
                    yield this.page.keyboard.press("ArrowDown");
                    yield this.page.keyboard.press("Enter");
                    const buttonsContainer = yield this.page.$("div.bg-white.shadow-lg.pt-10.pb-10.px-14.absolute.z-50 > div.mb-10.w-full.flex");
                    //buttonsContainer.chi;
                    console.log(buttonsContainer);
                    const destinationButton = yield this.page.$("span.w-1/2:nth-child(2)");
                    if (!destinationButton) {
                        throw new Error("Pepe");
                    }
                    yield destinationButton.click();
                    yield this.page.screenshot({ path: "example.png" });
                }
                catch (error) {
                    console.log(error);
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
exports.ScrappingService2 = ScrappingService2;
