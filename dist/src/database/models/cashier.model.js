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
                    franchise: {
                        connect: { id: franchiseId },
                    },
                },
            });
            if (!newCashier)
                return null;
            if (!isTokenRequired)
                return Object.assign(Object.assign({}, newCashier), { type: "cashier" });
            const token = yield (0, utils_1.generateToken)(newCashier.id, newCashier.email, "cashier");
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
            if (data.turnHasEnded) {
                const cashier = yield this.cashier.update({
                    where: {
                        id: updateData.id,
                    },
                    data: {
                        Turn: {
                            disconnect: true,
                        },
                    },
                });
                return cashier;
            }
            const { franchiseId } = data, others = __rest(data, ["franchiseId"]);
            const updatedCashier = yield this.cashier.update({
                where: {
                    id: updateData.id,
                },
                data: Object.assign(Object.assign({}, others), { franchise: {
                        connect: { id: data.franchiseId },
                    } }),
            });
            if (!updatedCashier)
                return null;
            return updatedCashier;
        });
    }
    get({ id, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cashierFound = id
                ? yield this.cashier.findUnique({
                    where: { id: id },
                    include: {
                        Turn: true,
                    },
                })
                : yield this.cashier.findUnique({ where: { email: email } });
            if (!cashierFound)
                return null;
            return Object.assign(Object.assign({}, cashierFound), { type: "cashier" });
        });
    }
    getAll([offset = 0, limit = 20], id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                const cashierList = yield this.cashier.findMany({
                    skip: offset,
                    take: limit,
                    where: {
                        franchise: {
                            id: id,
                        },
                    },
                    select: {
                        name: true,
                        email: true,
                        id: true,
                        createdAt: true,
                    },
                });
                if (!cashierList)
                    return null;
                return cashierList;
            }
            const cashierList = yield this.cashier.findMany({
                skip: offset,
                take: limit,
                select: {
                    name: true,
                    email: true,
                    id: true,
                    createdAt: true,
                    franchise: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });
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
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cashier.count();
        });
    }
    countForDate(lte, gte) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cashierCount = yield this.cashier.count({
                    where: {
                        createdAt: {
                            lte: lte,
                            gte: gte,
                        },
                    },
                });
                if (!cashierCount)
                    return null;
                return cashierCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const cashierModel = new Cashier(prisma_1.default.cashier);
exports.default = cashierModel;
