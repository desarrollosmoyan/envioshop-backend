"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("./stats.controller");
const statsRouter = (0, express_1.Router)();
statsRouter.get("/", stats_controller_1.getStats);
exports.default = statsRouter;
