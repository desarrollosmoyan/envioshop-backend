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
exports.roleName = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../database/prisma"));
const role_model_1 = __importDefault(require("../../database/models/role.model"));
var roleName;
(function (roleName) {
    roleName["admin"] = "admin";
    roleName["franchise"] = "franchise";
    roleName["cashier"] = "cashier";
})(roleName = exports.roleName || (exports.roleName = {}));
class User {
    constructor(user) {
        this.user = user;
    }
    encriptPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcrypt_1.genSalt)(10);
            return yield (0, bcrypt_1.hash)(password, salt);
        });
    }
    comparePassword(password, receivePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, bcrypt_1.compare)(password, receivePassword);
        });
    }
    generateToken(id, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ id: id, email: email, password: password }, `${process.env.SECRET_KEY_TOKEN}`);
        });
    }
    signup(signupData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, ubication, role } = signupData;
                const encryptedPassword = yield this.encriptPassword(password);
                if (!role)
                    throw new Error("Can't create user without role");
                const currentRole = yield role_model_1.default.assignRole(role);
                const user = yield this.user.create({
                    data: {
                        name: name,
                        email: email,
                        password: encryptedPassword,
                        ubication: ubication,
                        roleId: currentRole.id,
                    },
                });
                if (!user)
                    return new Error("Can't create user");
                const token = yield this.generateToken(user.id, user.email, user.password);
                return Object.assign(Object.assign({}, user), { token: token });
            }
            catch (error) {
                return new Error(error.message);
            }
        });
    }
    signin(signinData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = signinData;
                const user = yield this.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!user)
                    return new Error("User doesn't exist");
                const hasPasswordMatched = yield this.comparePassword(password, user.password);
                if (!hasPasswordMatched)
                    return new Error("Password doesn't match");
                const token = yield this.generateToken(user.id, user.email, user.password);
                return Object.assign(Object.assign({}, user), { token: token });
            }
            catch (error) {
                return new Error(error.message);
            }
        });
    }
    getUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findUnique({
                    where: Object.assign({}, userData),
                });
                if (!user)
                    return null;
                return user;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getUsers(offset, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userList = yield this.user.findMany({
                    take: offset,
                    skip: offset * page,
                });
                if (!userList)
                    return null;
                return userList;
            }
            catch (error) {
                throw new Error("Something wrong");
            }
        });
    }
    updateUser({ data, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userUpdated = yield this.user.update({
                    where: {
                        id: id,
                    },
                    data: Object.assign({}, data),
                });
                if (!userUpdated)
                    throw new Error("Can't update user");
                return userUpdated;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const userModel = new User(prisma_1.default.user);
exports.default = userModel;
