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
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const rating_route_1 = __importDefault(require("../modules/rating/rating.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const tracking_router_1 = __importDefault(require("../modules/tracking/tracking.router"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const shipping_route_1 = __importDefault(require("../modules/shipment/shipping.route"));
const cors = require("cors");
const axios_1 = __importDefault(require("axios"));
const server = (0, express_1.default)();
server.use(express_1.default.urlencoded({ extended: false }));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
server.use(cors());
server.use("/shipping", shipping_route_1.default);
server.use("/auth", auth_route_1.default);
server.use("/rating", rating_route_1.default);
server.use("/tracking", tracking_router_1.default);
server.use("/user", user_route_1.default);
server.use("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("username", "FENVIOSHOP");
        params.append("password", "Envioshop.22");
        const { data } = yield (0, axios_1.default)({
            method: "POST",
            url: "https://api.redpack.com.mx/oauth/token",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
                Authorization: `Basic YXBwLXJlZHBhY2std2ViOlIzZFBhY2smMjAyMA==`,
            },
            data: params,
        });
        console.log(data);
    }
    catch (error) {
        console.log(error);
        console.log(error.response);
    }
}));
exports.default = server;
