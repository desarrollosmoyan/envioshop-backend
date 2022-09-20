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
const prisma_1 = __importDefault(require("./prisma"));
var roleName;
(function (roleName) {
    roleName["admin"] = "admin";
    roleName["franchise"] = "franchise";
    roleName["cashier"] = "cashier";
})(roleName || (roleName = {}));
class Role {
    constructor(role) {
        this.role = role;
    }
    assignRole(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield this.role.findFirst({
                    where: {
                        name: type,
                    },
                });
                if (!role)
                    throw new Error("Can't find role");
                return role;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
const roleModel = new Role(prisma_1.default.role);
exports.default = roleModel;
