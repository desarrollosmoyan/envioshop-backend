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
exports.getOneSale = exports.getAllSales = exports.createOneSale = void 0;
const sales_model_1 = __importDefault(require("../../database/models/sales.model"));
const createOneSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const sale = yield sales_model_1.default.create(data);
        if (!sale)
            return res.status(400).json({ message: "Can't create sale" });
        res.status(200).json({ message: "Sale created successfully", sale: sale });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.createOneSale = createOneSale;
const getAllSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset, limit, cashierDetails } = req.query;
        const salesList = yield sales_model_1.default.getAll([
            parseInt(offset),
            parseInt(limit),
        ]);
        if (!salesList)
            return res.status(400).json({ message: "can't get sale list" });
        res.status(200).json({ salesList: salesList });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllSales = getAllSales;
const getOneSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const sale = yield sales_model_1.default.get(id);
        if (!sale)
            return res.status(400).json({ message: " Can't get sale" });
        res.status(200).json({ sale: sale });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getOneSale = getOneSale;
