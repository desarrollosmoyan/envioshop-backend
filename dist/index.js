"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsService = exports.dhlService = exports.fedexService = void 0;
require("dotenv").config();
const constants_1 = require("./src/constants");
const server_1 = __importDefault(require("./src/server/server"));
const service_1 = __importDefault(require("./src/service/service"));
exports.fedexService = new service_1.default(constants_1.FEDEX.baseUrl, Object.assign({}, constants_1.FEDEX.headers), constants_1.FEDEX.subServices, "Fedex");
exports.dhlService = new service_1.default(constants_1.DHL.baseUrl, Object.assign({}, constants_1.DHL.headers), constants_1.DHL.subServices, "DHL");
exports.upsService = new service_1.default(constants_1.UPS.baseUrl, Object.assign({}, constants_1.UPS.headers), constants_1.UPS.subServices, "UPS");
server_1.default.listen(process.env.PORT, () => {
    console.log(`Listening server on port:${process.env.PORT}`);
});
