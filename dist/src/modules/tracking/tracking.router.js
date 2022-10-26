"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tracking_controller_1 = require("./tracking.controller");
const trackingRouter = (0, express_1.Router)();
trackingRouter.post("/", tracking_controller_1.trackASingleShipment);
exports.default = trackingRouter;
