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
const model_1 = __importDefault(require("../../modules/auth/model"));
const prisma_1 = __importDefault(require("../prisma"));
class Turn {
    constructor(turn) {
        this.turn = turn;
    }
    create(turnData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, openBalance, user, userId } = turnData;
                const newTurn = yield this.turn.create({
                    data: {
                        startDate: startDate,
                        endDate: endDate,
                        openBalance: openBalance,
                        userId: !userId ? "" : userId,
                    },
                });
                if (!newTurn)
                    throw Error("Can't create turn");
            }
            catch (error) {
                throw Error("Can't create turn");
            }
        });
    }
    end(id, closeBalance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTurn = yield this.turn.update({
                    where: {
                        id: id,
                    },
                    data: {
                        endDate: new Date(Date.now()),
                        closeBalance: closeBalance,
                    },
                });
                if (!currentTurn)
                    throw Error("Can't end turn");
                return currentTurn;
            }
            catch (error) {
                throw Error("Can't end turn");
            }
        });
    }
    assign(id, turnData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.default.getUser({ id: id });
                if (!user)
                    throw new Error("Can't assing turn to current user");
                if (user.cashierId) {
                    const newTurn = yield this.create(turnData);
                    return newTurn;
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    deleteTurn(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) { }
        });
    }
}
const turnModel = new Turn(prisma_1.default.turn);
exports.default = turnModel;
