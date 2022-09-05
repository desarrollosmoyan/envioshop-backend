"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hello_controller_1 = require("./hello.controller");
const helloRouter = (0, express_1.Router)();
helloRouter.get("/", hello_controller_1.hello);
exports.default = helloRouter;
