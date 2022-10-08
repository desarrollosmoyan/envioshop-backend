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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createACashier = exports.createAFranchise = exports.deleteOneFranchise = exports.getAllCashiers = exports.getAllFranchises = exports.createOneAdmin = void 0;
const admin_model_1 = __importDefault(require("../../database/models/admin.model"));
const cashier_model_1 = __importDefault(require("../../database/models/cashier.model"));
const franchise_model_1 = __importDefault(require("../../database/models/franchise.model"));
const createOneAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAdmin = yield admin_model_1.default.create(req.body);
        if (!newAdmin)
            return res.status(401).json("Error");
        res
            .status(200)
            .json({ message: "Admin created successfully", admin: newAdmin });
    }
    catch (error) {
        res.status(400).json({ error: error, message: error.message });
    }
});
exports.createOneAdmin = createOneAdmin;
const getAllFranchises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const franchiseList = yield franchise_model_1.default.getAll();
        if (!franchiseList)
            return res.status(400).json({ message: "Error" });
        const franchiseListCleaned = franchiseList.map((franchiseItem) => {
            const { password, id } = franchiseItem, franchise = __rest(franchiseItem, ["password", "id"]);
            return franchise;
        });
        res.status(200).json([...franchiseListCleaned]);
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
    }
});
exports.getAllFranchises = getAllFranchises;
const getAllCashiers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashierList = yield cashier_model_1.default.getAll();
        if (!cashierList)
            return res.status(400).json({ message: "error" });
        res.status(200).json([...cashierList]);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllCashiers = getAllCashiers;
const deleteOneFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const franchiseId = req.params.id;
        const deletedFranchise = yield franchise_model_1.default.delete(franchiseId);
        if (!deletedFranchise)
            return res.status(400).json({ message: "Can't delete franchise" });
        res.status(200).json({ message: "Franchise deleted successfully" });
    }
    catch (error) { }
});
exports.deleteOneFranchise = deleteOneFranchise;
const createAFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const franchiseData = req.body;
        const newFranchise = yield franchise_model_1.default.create(franchiseData, false);
        if (!newFranchise)
            return res.status(401).json({ message: "Can't create franchise" });
        res.status(200).json({ franchise: newFranchise });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
});
exports.createAFranchise = createAFranchise;
const createACashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashierData = req.body;
        const newCashier = yield cashier_model_1.default.create(cashierData, false);
        if (!newCashier)
            return res.status(401).json({ message: "Can't create cashier" });
        res.status(200).json(Object.assign({ message: "User created successfully" }, newCashier));
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
});
exports.createACashier = createACashier;
