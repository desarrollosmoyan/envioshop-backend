"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rating_route_1 = __importDefault(require("../modules/rating/rating.route"));
const tracking_router_1 = __importDefault(require("../modules/tracking/tracking.router"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const turn_route_1 = __importDefault(require("../modules/turn/turn.route"));
const sales_router_1 = __importDefault(require("../modules/sales/sales.router"));
const me_route_1 = __importDefault(require("../modules/me/me.route"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/rating", rating_route_1.default);
mainRouter.use("/tracking", tracking_router_1.default);
mainRouter.use("/user", user_route_1.default);
mainRouter.use("/turn", turn_route_1.default);
mainRouter.use("/sales", sales_router_1.default);
mainRouter.use("/me", me_route_1.default);
exports.default = mainRouter;
