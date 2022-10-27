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
//import userModel from "../../modules/auth/model";
const prisma_1 = __importDefault(require("../prisma"));
class Turn {
    constructor(turn) {
        this.turn = turn;
    }
    create(turnCreateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { openBalance, cashierId } = turnCreateData;
            try {
                const newTurn = yield this.turn.create({
                    data: {
                        startDate: new Date(Date.now()),
                        endDate: null,
                        openBalance: openBalance,
                        cashier: {
                            connect: {
                                id: cashierId,
                            },
                        },
                        lastCashierId: cashierId,
                        closeBalance: openBalance,
                        sales: undefined,
                    },
                });
                if (!newTurn)
                    return null;
                return newTurn;
            }
            catch (error) {
                throw error;
            }
        });
    }
    end(id, closeBalance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const turnUpdated = yield this.turn.update({
                    where: {
                        id: id,
                    },
                    data: {
                        endDate: new Date(Date.now()),
                        closeBalance: closeBalance,
                        cashier: {
                            disconnect: true,
                        },
                    },
                });
                if (!turnUpdated)
                    return null;
                return turnUpdated;
            }
            catch (error) {
                return error;
            }
        });
    }
    get({ id, cashierId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const turn = yield this.turn.findUnique({
                    where: {
                        id: id,
                        cashierId: cashierId,
                    },
                });
                if (!turn)
                    return null;
                return turn;
            }
            catch (error) {
                return error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
const turnModel = new Turn(prisma_1.default.turn);
exports.default = turnModel;
