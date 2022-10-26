"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shipping_controller_1 = require("./shipping.controller");
const shippingRouter = (0, express_1.Router)();
shippingRouter.post("/:company", shipping_controller_1.createShipment);
exports.default = shippingRouter;
