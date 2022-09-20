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
exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const model_1 = __importDefault(require("../auth/model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, offset } = req.query;
        const userList = yield model_1.default.getUsers(parseInt(page), parseInt(offset));
        res.status(200).json({ users: userList });
    }
    catch (error) {
        res.status(400).json({ message: error.message, error: error });
    }
});
exports.getAllUsers = getAllUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = req.body;
        const newUser = yield model_1.default.signup(userInfo);
        res.status(200).json({
            message: "User created successfuly",
            user: Object.assign(Object.assign({}, newUser), { token: null, password: null }),
        });
    }
    catch (error) {
        res.status(404).json({
            message: "Can't create user",
        });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userNewData = { data: Object.assign({}, req.body), id: req.params.id };
        const userUpdated = yield model_1.default.updateUser(userNewData);
        if (!userUpdated)
            return res.status(401).json({ message: "Bad Request" });
        res.status(200).json({
            message: "User updated successfully",
            user: Object.assign({}, userUpdated),
        });
    }
    catch (error) {
        res.status(400).json({ error: error, message: error.message });
    }
});
exports.updateUser = updateUser;
