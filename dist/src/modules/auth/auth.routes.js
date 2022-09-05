"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("./auth.middleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/signin", auth_controller_1.signinHandler);
authRouter.post("/signup", [auth_middleware_1.checkExistingUser], auth_controller_1.signupHandler);
exports.default = authRouter;
