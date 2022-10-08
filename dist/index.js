"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAQUETEEXPRESSService = exports.ESTAFETAService = exports.REDPACKService = exports.UPSService = exports.DHLService = exports.FEDEXService = void 0;
require("dotenv").config();
//import { RedisClientType } from "@redis/client";
//import { createClient } from "redis";
const constants_1 = require("./src/constants");
const server_1 = __importDefault(require("./src/server/server"));
const service_1 = require("./src/service/service");
exports.FEDEXService = new service_1.ApiService(constants_1.FEDEX);
exports.DHLService = new service_1.ApiService(constants_1.DHL);
exports.UPSService = new service_1.ApiService(constants_1.UPS);
exports.REDPACKService = new service_1.ApiService(constants_1.REDPACK);
exports.ESTAFETAService = new service_1.ScrappingService(constants_1.ESTAFETA);
exports.PAQUETEEXPRESSService = new service_1.ApiService(constants_1.PAQUETEEXPRESSSERVICE);
exports.FEDEXService.setAuthorization();
exports.REDPACKService.setAuthorization();
/*export const redisConnection = connectRedis();
connectRedis().then(async (redis) => {
  await FEDEXService.setAuthorization();
  const token = await FEDEXService.getAuthorization();
  await redis.set("FEDEXTOKEN", token);
});*/
server_1.default.listen(process.env.PORT, () => {
    console.log(`Listening server on port:${process.env.PORT}`);
});
