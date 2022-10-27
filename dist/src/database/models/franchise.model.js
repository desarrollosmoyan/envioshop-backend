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
const utils_2 = require("../../utils/utils");
class Franchise {
    constructor(franchise) {
        this.franchise = franchise;
    }
    getAll([offset = 0, limit = 20]) {
        return __awaiter(this, void 0, void 0, function* () {
            const franchiseList = yield this.franchise.findMany({
                skip: offset,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    ubication: true,
                    cellphone: true,
                    createdAt: true,
                    sales: {
                        select: {
                            id: true,
                        },
                    },
                    cashiers: {
                        select: {
                            name: true,
                            email: true,
                            id: true,
                        },
                    },
                },
            });
            if (!franchiseList)
                return null;
            return franchiseList;
        });
    }
    create(data, isTokenRequired) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, password, email, ubication, cellphone } = data;
            const encryptedPassword = yield (0, utils_1.encryptPassword)(password);
            try {
                const newFranchise = yield this.franchise.create({
                    data: {
                        name: name,
                        password: encryptedPassword,
                        email: email,
                        cellphone: cellphone,
                        ubication: ubication,
                        sales: undefined,
                        cashiers: undefined,
                    },
                });
                if (!newFranchise)
                    return null;
                if (!isTokenRequired)
                    return Object.assign(Object.assign({}, newFranchise), { type: "franchise" });
                const token = yield (0, utils_2.generateToken)(newFranchise.id, newFranchise.email, "franchise");
                return Object.assign(Object.assign({}, newFranchise), { type: "franchise", token: token });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    update(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, data } = updateData;
            const updatedFranchise = yield this.franchise.update({
                where: {
                    id: id,
                },
                data: Object.assign({}, data),
            });
            if (!updatedFranchise)
                return null;
            return updatedFranchise;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedFranchise = yield this.franchise.delete({
                where: {
                    id: id,
                },
            });
            if (!deletedFranchise)
                return null;
            return deletedFranchise;
        });
    }
    get({ id, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            const franchiseFound = id
                ? yield this.franchise.findUnique({
                    where: { id: id },
                    include: {
                        cashiers: true,
                    },
                })
                : yield this.franchise.findUnique({
                    where: { email: email },
                    include: {
                        cashiers: true,
                    },
                });
            if (!franchiseFound)
                return null;
            return Object.assign(Object.assign({}, franchiseFound), { type: "franchise" });
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.franchise.count();
        });
    }
    countForDate(lte, gte) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const franchiseCount = yield this.franchise.count({
                    where: {
                        createdAt: {
                            lte: lte,
                            gte: gte,
                        },
                    },
                });
                if (!franchiseCount)
                    return null;
                return franchiseCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTopFranchises() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const franchiseList = yield this.franchise.findMany({
                    where: {
                        sales: {
                            some: {},
                        },
                    },
                    take: 5,
                    select: {
                        name: true,
                        sales: {
                            orderBy: [
                                {
                                    shipmentPrice: "asc",
                                },
                            ],
                        },
                    },
                });
                if (!franchiseList)
                    return null;
                return franchiseList;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
const franchiseModel = new Franchise(prisma_1.default.franchise);
exports.default = franchiseModel;
