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
exports.getStatsFromOneFranchise = exports.getStats = void 0;
const sales_model_1 = __importDefault(require("../../database/models/sales.model"));
const franchise_model_1 = __importDefault(require("../../database/models/franchise.model"));
const cashier_model_1 = __importDefault(require("../../database/models/cashier.model"));
const jsonwebtoken_1 = require("jsonwebtoken");
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (0, jsonwebtoken_1.decode)(req.token);
    const id = payload.id;
    console.log(payload);
    if (payload.type === "admin") {
        try {
            const today = new Date(Date.now());
            const prevDays = new Date();
            prevDays.setDate(today.getDate() - 7);
            const totalShipments = yield sales_model_1.default.countForDate(today, prevDays);
            console.log(totalShipments);
            const totalEarned = yield sales_model_1.default.countTotalEarned(today, prevDays);
            const totalFranchises = yield franchise_model_1.default.countForDate(today, prevDays);
            const totalCashiers = yield cashier_model_1.default.countForDate(today, prevDays);
            const recentShipments = yield sales_model_1.default.getRecentShipments(today, prevDays);
            const topFranchises = yield franchise_model_1.default.getTopFranchises();
            if (!topFranchises)
                throw new Error("error");
            res.status(200).json({
                message: "Stats getted successfully",
                totalCashiers: totalCashiers,
                totalFranchises: totalFranchises,
                totalShipments: totalShipments ? totalShipments : 0,
                totalEarned: totalEarned ? totalEarned.toFixed(2) : 0,
                recentShipments: recentShipments ? recentShipments : null,
                topFranchises: topFranchises ? topFranchises : null,
            });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message });
        }
    }
    else {
        try {
            const payload = (0, jsonwebtoken_1.decode)(req.token);
            const id = payload.id;
            const today = new Date(Date.now());
            const prevDays = new Date();
            prevDays.setDate(today.getDate() - 7);
            const totalEarned = yield sales_model_1.default.countTotalEarned(today, prevDays, id);
            const totalShipments = yield sales_model_1.default.countForDate(today, prevDays, id);
            const totalCashiers = yield cashier_model_1.default.countForDate(today, prevDays, id);
            const recentShipments = yield sales_model_1.default.getRecentShipments(today, prevDays, id);
            const topFranchises = yield franchise_model_1.default.getTopFranchises();
            res.status(200).json({
                message: "Stats getted successfully",
                totalCashiers: totalEarned,
                totalShipments: totalShipments,
                totalEarned: totalEarned,
                recentShipments: recentShipments,
                topFranchises: topFranchises,
            });
        }
        catch (error) {
            console.log(error.message);
            res.status(400).json({ message: "Error something happened" });
        }
    }
});
exports.getStats = getStats;
const getStatsFromOneFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, jsonwebtoken_1.decode)(req.token);
        const id = payload.id;
        const today = new Date(Date.now());
        const prevDays = new Date();
        prevDays.setDate(today.getDate() - 7);
        const totalEarned = yield sales_model_1.default.countTotalEarned(today, prevDays, id);
        const totalShipments = yield sales_model_1.default.countForDate(today, prevDays, id);
        const totalCashiers = yield cashier_model_1.default.countForDate(today, prevDays, id);
        const topFranchises = yield franchise_model_1.default.getTopFranchises();
        res.status(200).json({
            message: "Stats getted successfully",
            totalCashiers: totalCashiers ? totalCashiers : 0,
            totalShipments: totalShipments ? totalShipments : 0,
            totalEarned: totalEarned ? totalEarned.toFixed(2) : 0,
            topFranchises: topFranchises ? topFranchises : 0,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error something happened" });
    }
});
exports.getStatsFromOneFranchise = getStatsFromOneFranchise;
