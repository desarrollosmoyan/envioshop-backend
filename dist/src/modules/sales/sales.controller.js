"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFranchisesWithSales = exports.getSalesCount = exports.getOneSale = exports.getAllSales = exports.createOneSale = void 0;
const sales_model_1 = __importStar(require("../../database/models/sales.model"));
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
        const { offset, limit } = req.query;
        let svcName;
        let lte;
        let gte;
        console.log(req.query);
        if (req.query.serviceName) {
            svcName = sales_model_1.serviceName[req.query.serviceName];
        }
        if (req.query.lte && req.query.gte) {
            lte = new Date(req.query.lte);
            gte = new Date(req.query.gte);
        }
        const salesList = yield sales_model_1.default.getAll([parseInt(offset), parseInt(limit)], svcName, lte, gte);
        const count = yield sales_model_1.default.count(null);
        if (!salesList) {
            return res.status(400).json({ message: "can't get sale list" });
        }
        res.status(200).json({ salesList: salesList, count: count });
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
const getSalesCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id ? req.body.id : null;
        const count = yield sales_model_1.default.count(id);
        if (!count)
            throw new Error("Error");
        res.status(200).json({ count: count });
    }
    catch (error) {
        res.status(400).json({ message: "Something is wrong" });
    }
});
exports.getSalesCount = getSalesCount;
const getFranchisesWithSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset, limit } = req.query;
        const list = yield sales_model_1.default.getFranchisesWithShipments([
            parseInt(offset),
            parseInt(limit),
        ]);
        if (!list)
            throw new Error("Something wrong");
        const returnedList = list
            .map((item) => item.franchise)
            .reduce((acc, cur, i) => {
            const key = "name";
            const alreadyExists = acc.find((item) => item.name === cur.name);
            return alreadyExists ? acc : [...acc, cur];
        }, []);
        res.status(200).json({
            message: "Successfully request",
            franchises: returnedList,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something is wrong" });
    }
});
exports.getFranchisesWithSales = getFranchisesWithSales;
