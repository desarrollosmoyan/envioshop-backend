"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("./sales.controller");
const salesRouter = (0, express_1.Router)();
salesRouter.get("/", sales_controller_1.getAllSales);
salesRouter.post("/", sales_controller_1.createOneSale);
salesRouter.get("/:id", sales_controller_1.getOneSale);
exports.default = salesRouter;
