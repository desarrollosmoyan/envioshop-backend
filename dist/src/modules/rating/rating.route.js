"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkJWT_1 = require("../../middleware/checkJWT");
const rating_controller_1 = require("./rating.controller");
const ratingRouter = (0, express_1.Router)();
ratingRouter.post("/", [checkJWT_1.checkJWT], rating_controller_1.getRating);
exports.default = ratingRouter;
