"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onlyAdmin_1 = __importDefault(require("../../middleware/onlyAdmin"));
const onlyFranchise_1 = __importDefault(require("../../middleware/onlyFranchise"));
const user_controller_1 = require("./user.controller");
const userRouter = (0, express_1.Router)();
userRouter.post("/admin", user_controller_1.createOneAdmin);
userRouter.get("/", user_controller_1.getUser);
userRouter.post("/franchise", [onlyAdmin_1.default], user_controller_1.createAFranchise);
userRouter.get("/franchise", [onlyAdmin_1.default], user_controller_1.getAllFranchises);
userRouter.get("/franchise/:id", [onlyAdmin_1.default], user_controller_1.getOneFranchise);
userRouter.delete("/franchise/:id", [onlyAdmin_1.default], user_controller_1.deleteOneFranchise);
userRouter.put("/franchise/:id", [onlyAdmin_1.default], user_controller_1.updateOneFranchise);
userRouter.get("/me", user_controller_1.getMe);
userRouter.get("/cashier", [onlyFranchise_1.default], user_controller_1.getAllCashiers);
userRouter.post("/cashier", [onlyFranchise_1.default], user_controller_1.createACashier);
userRouter.delete("/cashier/:id", [onlyFranchise_1.default], user_controller_1.deleteOneCashier);
userRouter.put("/cashier/:id", [onlyFranchise_1.default], user_controller_1.updateOneCashier);
userRouter.get("/cashier/:id", [onlyFranchise_1.default], user_controller_1.getOneCashier);
exports.default = userRouter;
