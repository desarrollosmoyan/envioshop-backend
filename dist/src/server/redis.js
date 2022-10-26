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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, redis_1.createClient)({
        url: `${process.env.REDIS_URL}`,
    });
    client.on("ready", () => console.log("Redis DB connected successfully"));
    client.on("error", (error) => console.log(error));
    yield client.connect();
    return client;
});
exports.connectRedis = connectRedis;
