"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endTurn = exports.assignTurn = void 0;
const cashier_model_1 = __importDefault(require("../../database/models/cashier.model"));
const turn_model_1 = __importDefault(require("../../database/models/turn.model"));
const assignTurn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cashierId, openBalance } = req.body;
        const turn = yield turn_model_1.default.create({ cashierId, openBalance });
        if (!turn)
            return res.status(401).json({ message: "Can't create turn" });
        res.status(200).json({ turn: turn, message: "Turn created successfully" });
    }
    catch (error) {
        res.status(404).json({ message: "Something is wrong" });
    }
});
exports.assignTurn = assignTurn;
const endTurn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { turnId, closeBalance } = req.body;
        const turn = yield turn_model_1.default.end(turnId, closeBalance);
        if (!turn)
            return res.status(401).json({ message: "Can't end turn" });
        cashier_model_1.default.update({
            id: turn.cashierId,
            data: {
                currentTurn: undefined,
            },
        });
        res.status(200).json({ turn: turn, message: "Turn ended successfully" });
    }
    catch (error) {
        res.status(404).json({ message: "" });
    }
});
exports.endTurn = endTurn;
