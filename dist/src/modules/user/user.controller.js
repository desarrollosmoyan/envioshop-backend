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
exports.getMe = exports.getAllCashiersFromOneFranchise = exports.deleteOneCashier = exports.getFranchiseBySearch = exports.getOneCashier = exports.updateOneCashier = exports.createACashier = exports.createAFranchise = exports.deleteManyCashiers = exports.deleteManyFranchises = exports.deleteOneFranchise = exports.updateOneFranchise = exports.getAllCashiers = exports.getOneFranchise = exports.getAllFranchisesCities = exports.getAllFranchisesByCity = exports.getAllFranchises = exports.createOneAdmin = exports.getUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const admin_model_1 = __importDefault(require("../../database/models/admin.model"));
const cashier_model_1 = __importDefault(require("../../database/models/cashier.model"));
const franchise_model_1 = __importDefault(require("../../database/models/franchise.model"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (0, jsonwebtoken_1.decode)(req.token);
    const map = {
        admin: () => admin_model_1.default.get({ id: payload.id }),
        franchise: () => franchise_model_1.default.get({ id: payload.id }),
        cashier: () => cashier_model_1.default.get({ id: payload.id }),
    };
    const { type } = payload;
    const user = yield map[type]();
    try {
        if (!user)
            throw new Error("Can't get user");
        res.status(200).json({
            message: "User getted successfully",
            user: {
                name: user.name,
                email: user.email,
                type: user.type,
            },
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.getUser = getUser;
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
        console.log("sexo");
        const { offset, limit } = req.query;
        const body = req.body;
        const franchiseList = yield franchise_model_1.default.getAll([parseInt(offset), parseInt(limit)], body.cityName);
        const totalFranchises = yield franchise_model_1.default.count();
        if (!franchiseList)
            return res.status(400).json({ message: "Error" });
        res
            .status(200)
            .json({ total: totalFranchises, franchises: [...franchiseList] });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error" });
    }
});
exports.getAllFranchises = getAllFranchises;
const getAllFranchisesByCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset, limit } = req.query;
        const cityName = req.body.cityName;
        const list = yield franchise_model_1.default.getAll([parseInt(offset), parseInt(limit)], cityName);
        const totalFranchises = yield franchise_model_1.default.count();
        if (!list)
            throw new Error("Something wrong");
        res.status(200).json({
            message: "successfully",
            franchises: list,
            total: totalFranchises,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
    }
});
exports.getAllFranchisesByCity = getAllFranchisesByCity;
const getAllFranchisesCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset, limit } = req.query;
        const franchisesCitiesList = yield franchise_model_1.default.getAllFranchiseCities([
            parseInt(offset),
            parseInt(limit),
        ]);
        if (!franchisesCitiesList)
            throw new Error("Something is wrong");
        res
            .status(200)
            .json({ message: "Sucessfully request", cities: franchisesCitiesList });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllFranchisesCities = getAllFranchisesCities;
const getOneFranchise = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const payload = decode(req.token as string) as JwtPayload;
        console.log("entro get one franchise");
        console.log(req.body);
        console.log(req.params);
        console.log(req.url);
        const franchiseId = req.params.id;
        const franchise = yield franchise_model_1.default.get({ id: franchiseId });
        if (!franchise)
            return res.status(400).json({ message: "Can't get current franchise" });
        res.status(200).json(Object.assign({}, franchise));
    }
    catch (error) {
        console.log(error);
    }
});
exports.getOneFranchise = getOneFranchise;
const getAllCashiers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset = 0, limit = 0 } = req.query;
        const cashierList = yield cashier_model_1.default.getAll([parseInt(offset), parseInt(limit)], undefined);
        const cashierCount = yield cashier_model_1.default.count();
        if (!cashierList)
            return res.status(400).json({ message: "error" });
        res.status(200).json({ total: cashierCount, cashiers: [...cashierList] });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllCashiers = getAllCashiers;
const updateOneFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const franchiseId = req.params.id;
        const updatedFranchsie = yield franchise_model_1.default.update({
            id: franchiseId,
            data: req.body,
        });
        if (!updatedFranchsie)
            return res.status(400).json({ message: "Can't update franchise" });
        res.status(200).json({ message: "Franchise updated successfully" });
    }
    catch (error) {
        res.status(400).json({ message: "Something wrong" });
    }
});
exports.updateOneFranchise = updateOneFranchise;
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
const deleteManyFranchises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const franchisesIds = req.body.ids;
        const deletedFranchises = yield franchise_model_1.default.deleteMany(franchisesIds);
        if (!deletedFranchises)
            throw new Error("Something is wrong");
        res.status(200).json({ message: "Sucessfully operation" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deleteManyFranchises = deleteManyFranchises;
const deleteManyCashiers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashiersIds = req.body.ids;
        const deletedCashiers = yield cashier_model_1.default.deleteMany(cashiersIds);
        console.log(deletedCashiers);
        if (!deletedCashiers)
            throw new Error("Something is wrong");
        res.status(200).json({ message: "Sucessfully operation" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deleteManyCashiers = deleteManyCashiers;
const createAFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, jsonwebtoken_1.decode)(req.token);
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
const updateOneCashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashierId = req.params.id;
        const updatedCashier = yield cashier_model_1.default.update({
            id: cashierId,
            data: req.body,
        });
        if (!updatedCashier)
            return res.status(400).json({ message: "Can't update cashier" });
        res.status(200).json({
            message: "Cashier updated successfully",
            cashier: updatedCashier,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.updateOneCashier = updateOneCashier;
const getOneCashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashierId = req.params.id;
        const cashier = yield cashier_model_1.default.get({ id: cashierId });
        if (!cashier)
            return res.status(400).json({ message: "Can't get current cashier" });
        return res.status(200).json(Object.assign({}, cashier));
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getOneCashier = getOneCashier;
const getFranchiseBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = req.params.value;
        if (!value)
            throw new Error("Value is null");
        console.log(req.params.offset, req.params.limit);
        const offset = parseInt(req.query.offset);
        const limit = parseInt(req.query.limit);
        const franchisesMatched = yield franchise_model_1.default.getBySearch(value, [
            offset,
            limit,
        ]);
        if (!franchise_model_1.default)
            throw new Error("Something is wrong");
        res.status(200).json({
            message: "Successfully Operation",
            franchises: franchisesMatched,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.getFranchiseBySearch = getFranchiseBySearch;
const deleteOneCashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cashierId = req.params.id;
        const deletedCashier = yield cashier_model_1.default.delete(cashierId);
        if (!deletedCashier)
            return res.status(400).json({ message: "Can't delete cashier" });
        res.status(200).json({ message: "Franchise deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deleteOneCashier = deleteOneCashier;
const getAllCashiersFromOneFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset, limit } = req.params;
        const payload = (0, jsonwebtoken_1.decode)(req.token);
        const cashiersList = yield cashier_model_1.default.getAll([parseInt(offset), parseInt(limit)], payload.id);
        if (!cashiersList)
            throw new Error("Something wrong");
        return res
            .status(200)
            .json({ message: "List of cashiers", cashiers: [...cashiersList] });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAllCashiersFromOneFranchise = getAllCashiersFromOneFranchise;
const userMap = {
    admin: (id) => {
        return admin_model_1.default.get({ id: id });
    },
    franchise: (id) => {
        return franchise_model_1.default.get({ id: id });
    },
    cashier: (id) => {
        return cashier_model_1.default.get({ id: id });
    },
};
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, jsonwebtoken_1.decode)(req.token);
        const me = yield userMap[payload.type](payload.id);
        if (!me)
            throw new Error("User doesn't exist");
        res.status(200).json({ message: "User getted sucessfully", user: me });
    }
    catch (err) {
        res.status(400).json({ message: "error" });
    }
});
exports.getMe = getMe;
