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
const prisma_1 = __importDefault(require("../prisma"));
var serviceName;
(function (serviceName) {
    serviceName["FEDEX"] = "FEDEX";
    serviceName["DHL"] = "DHL";
    serviceName["REDPACK"] = "REDPACK";
    serviceName["ESTAFETA"] = "ESTAFETA";
    serviceName["UPS"] = "UPS";
})(serviceName || (serviceName = {}));
class Sales {
    constructor(sale) {
        this.sale = sale;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSale = yield this.sale.create({
                    data: Object.assign({}, data),
                });
                if (!newSale)
                    return null;
                return newSale;
            }
            catch (error) { }
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
const salesModel = new Sales(prisma_1.default.sales);
