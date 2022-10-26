"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turn_controller_1 = require("./turn.controller");
const turnRouter = (0, express_1.Router)();
turnRouter.post("/:id", turn_controller_1.assignTurn);
turnRouter.put("/:id", turn_controller_1.endTurn);
exports.default = turnRouter;
