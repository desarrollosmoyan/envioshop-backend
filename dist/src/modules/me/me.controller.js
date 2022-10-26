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
exports.getUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const admin_model_1 = __importDefault(require("../../database/models/admin.model"));
const cashier_model_1 = __importDefault(require("../../database/models/cashier.model"));
const franchise_model_1 = __importDefault(require("../../database/models/franchise.model"));
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
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    const { id, type } = (0, jsonwebtoken_1.verify)(token, `${process.env.SECRET_KEY_TOKEN}`);
    try {
        const data = yield userMap[type](id);
        if (!data)
            throw new Error("User doesn't exists");
        const { password } = data, otherData = __rest(data, ["password"]);
        res.status(200).json({
            message: "User found successfully",
            user: Object.assign({}, otherData),
        });
    }
    catch (err) {
        res.status(400).json({ message: "Something is wrong!" });
    }
});
exports.getUser = getUser;
