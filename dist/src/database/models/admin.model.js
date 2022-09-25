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
const utils_1 = require("../../utils/utils");
const prisma_1 = __importDefault(require("../prisma"));
class Admin {
    constructor(admin) {
        this.admin = admin;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = data;
            const encryptedPassword = yield (0, utils_1.encryptPassword)(password);
            const newAdmin = yield this.admin.create({
                data: {
                    name: name,
                    email: email,
                    password: encryptedPassword,
                },
            });
            const token = yield (0, utils_1.generateToken)(newAdmin.id, newAdmin.email, newAdmin.password, "admin");
            if (!newAdmin)
                return null;
            return Object.assign(Object.assign({}, newAdmin), { token: token });
        });
    }
    get({ id, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminFound = id
                ? yield this.admin.findUnique({ where: { id: id } })
                : yield this.admin.findUnique({ where: { email: email } });
            if (!adminFound)
                return null;
            return Object.assign(Object.assign({}, adminFound), { type: "admin" });
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
const adminModel = new Admin(prisma_1.default.admin);
exports.default = adminModel;
