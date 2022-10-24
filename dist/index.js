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
exports.redisConnection = exports.PAQUETEEXPRESSService = exports.ESTAFETAService = exports.REDPACKService = exports.UPSService = exports.DHLService = exports.FEDEXService = void 0;
require("dotenv").config();
//import { RedisClientType } from "@redis/client";
//import { createClient } from "redis";
const constants_1 = require("./src/constants");
const redis_1 = require("./src/server/redis");
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
exports.redisConnection = (0, redis_1.connectRedis)();
(0, redis_1.connectRedis)().then((redis) => __awaiter(void 0, void 0, void 0, function* () {
    const fedexToken = yield redis.get("FEDEXTOKEN");
    const redpackToken = yield redis.get("REDPACKTOKEN");
    if (!fedexToken || !redpackToken) {
        yield exports.FEDEXService.setAuthorization();
        yield exports.REDPACKService.setAuthorization();
    }
    /* const token = await FEDEXService.getAuthorization();
    const rpToken = await REDPACKService.getAuthorization();
    await redis.set("FEDEXTOKEN", JSON.stringify(token));
    await redis.set("REDPACKTOKEN", JSON.stringify(rpToken));
    const p = await redis.get("FEDEXTOKEN");
    const t = await redis.get("REDPACKTOKEN");
    console.log(JSON.parse(t as string));*/
}));
server_1.default.listen(process.env.PORT, () => {
    console.log(`Listening server on port:${process.env.PORT}`);
});
