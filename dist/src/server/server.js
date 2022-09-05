"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const rating_route_1 = __importDefault(require("../modules/rating/rating.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const tracking_router_1 = __importDefault(require("../modules/tracking/tracking.router"));
const server = (0, express_1.default)();
server.use(express_1.default.urlencoded({ extended: false }));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
server.use("/auth", auth_route_1.default);
server.use("/rating", rating_route_1.default);
server.use("/tracking", tracking_router_1.default);
exports.default = server;
