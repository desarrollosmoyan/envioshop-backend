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
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Users {
    constructor(prismaUser) {
        this.prismaUser = prismaUser;
    }
    encryptPassword({ password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcrypt_1.genSalt)(10);
            return yield (0, bcrypt_1.hash)(password, salt);
        });
    }
    comparePassword({ password, receivePassword }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, bcrypt_1.compare)(password, receivePassword);
        });
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = data;
                const encryptedPassword = yield this.encryptPassword({
                    password: password,
                });
                data.password = encryptedPassword;
                const user = yield this.prismaUser.create({ data });
                const token = this.generateToken({
                    id: user.id,
                    email: user.email,
                    role: user.roleId,
                });
                return Object.assign(Object.assign({}, user), { token: token });
            }
            catch (error) {
                throw error;
            }
        });
    }
    signin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = data;
                const user = yield this.prismaUser.findUniqueOrThrow({
                    where: {
                        email: email,
                    },
                });
                if (user) {
                    const matchPassword = yield this.comparePassword({
                        password: password,
                        receivePassword: user.password,
                    });
                    if (!matchPassword) {
                        return null;
                    }
                    const token = this.generateToken({
                        id: user.id,
                        email: user.email,
                        role: user.roleId,
                    });
                    const populatedUser = yield this.populateRole(user);
                    return Object.assign(Object.assign({}, populatedUser), { token: token });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateToken({ id, email, role, }) {
        return jsonwebtoken_1.default.sign({ id: id, email: email, role: role }, `${process.env.SECRET_KEY_TOKEN}`);
    }
    populateRole(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const populatedUser = yield this.prismaUser.findFirst({
                where: {
                    id: user.id,
                },
                include: {
                    Role: true,
                },
            });
            return populatedUser;
        });
    }
}
exports.default = Users;
