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
exports.serviceName = void 0;
const prisma_1 = __importDefault(require("../prisma"));
var serviceName;
(function (serviceName) {
    serviceName["FEDEX"] = "FEDEX";
    serviceName["DHL"] = "DHL";
    serviceName["REDPACK"] = "REDPACK";
    serviceName["ESTAFETA"] = "ESTAFETA";
    serviceName["UPS"] = "UPS";
})(serviceName = exports.serviceName || (exports.serviceName = {}));
class Sales {
    constructor(sale) {
        this.sale = sale;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { franchiseId, turnId } = data, newData = __rest(data, ["franchiseId", "turnId"]);
                const newSale = yield this.sale.create({
                    data: Object.assign(Object.assign({}, newData), { franchise: {
                            connect: {
                                id: franchiseId,
                            },
                        }, Turn: {
                            connect: { id: turnId },
                        } }),
                });
                if (!newSale)
                    return null;
                return newSale;
            }
            catch (error) {
                throw error;
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sale = yield this.sale.findUnique({
                    where: {
                        id: id,
                    },
                });
                if (!sale)
                    return null;
                return sale;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAll([offset, limit]) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saleList = yield this.sale.findMany({
                    skip: offset,
                    take: limit,
                    include: {
                        franchise: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                            },
                        },
                        Turn: {
                            select: {
                                id: true,
                                createdAt: true,
                                cashier: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!saleList)
                    return null;
                return saleList;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteOne() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    countForDate(lte, gte) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saleList = yield this.sale.count({
                    where: {
                        createdAt: {
                            lte: lte,
                            gte: gte,
                        },
                    },
                });
                if (!saleList)
                    return null;
                return saleList;
            }
            catch (error) {
                throw error;
            }
        });
    }
    countTotalEarned(lte, gte) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalEarned = yield this.sale.findMany({
                    where: {
                        createdAt: {
                            lte: lte,
                            gte: gte,
                        },
                    },
                    select: {
                        shipmentPrice: true,
                    },
                });
                const total = totalEarned.map((item) => Object.values(item)[0]);
                return total.reduce((prev, current) => prev + current, 0);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const salesModel = new Sales(prisma_1.default.sales);
exports.default = salesModel;
