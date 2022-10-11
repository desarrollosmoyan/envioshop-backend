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
class Cashier {
    constructor(cashier) {
        this.cashier = cashier;
    }
    create(data, isTokenRequired) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, password, email, franchiseId } = data;
            const encryptedPassword = yield (0, utils_1.encryptPassword)(password);
            const newCashier = yield this.cashier.create({
                data: {
                    name: name,
                    password: encryptedPassword,
                    email: email,
                    franchiseId: franchiseId,
                },
            });
            if (!newCashier)
                return null;
            if (!isTokenRequired)
                return Object.assign(Object.assign({}, newCashier), { type: "cashier" });
            const token = yield (0, utils_1.generateToken)(newCashier.id, newCashier.email, newCashier.password, "cashier");
            return Object.assign(Object.assign({}, newCashier), { type: "cashier", token: token });
        });
    }
    assignFranchise(cashierId, franchiseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cashierUpdated = yield this.cashier.update({
                where: {
                    id: cashierId,
                },
                data: {
                    franchiseId: franchiseId,
                },
            });
            if (!cashierUpdated)
                return null;
            return cashierUpdated;
        });
    }
    update(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = updateData;
            const updatedCashier = yield this.cashier.update({
                where: {
                    id: updateData.id,
                },
                data: Object.assign({}, data),
            });
            if (!updatedCashier)
                return null;
            return updatedCashier;
        });
    }
    get({ id, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cashierFound = id
                ? yield this.cashier.findUnique({ where: { id: id } })
                : yield this.cashier.findUnique({ where: { email: email } });
            if (!cashierFound)
                return null;
            return Object.assign(Object.assign({}, cashierFound), { type: "cashier" });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const cashierList = yield this.cashier.findMany();
            if (!cashierList)
                return null;
            return cashierList;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedCashier = yield this.cashier.delete({
                where: {
                    id: id,
                },
            });
            if (!deletedCashier)
                return null;
            return deletedCashier;
        });
    }
}
const cashierModel = new Cashier(prisma_1.default.cashier);
exports.default = cashierModel;
