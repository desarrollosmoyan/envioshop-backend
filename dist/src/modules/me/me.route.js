"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJWT_1 = require("../../middleware/checkJWT");
const me_controller_1 = require("./me.controller");
const meRouter = (0, express_1.Router)();
meRouter.get("/", [checkJWT_1.checkJWT], me_controller_1.getUser);
exports.default = meRouter;
