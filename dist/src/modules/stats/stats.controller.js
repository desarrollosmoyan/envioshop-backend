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
const sales_model_1 = __importDefault(require("../../database/models/sales.model"));
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date(Date.now());
    const prevDays = new Date();
    prevDays.setDate(today.getDate() - 7);
    const totalShipments = yield sales_model_1.default.getOneFromDate(today, prevDays);
    if (!totalShipments) {
        return res.status(400).json({ message: "Something wrong" });
    }
});
