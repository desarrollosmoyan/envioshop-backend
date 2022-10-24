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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShipments = exports.createShipment = void 0;
const __1 = require("../../..");
const sales_model_1 = require("../../database/models/sales.model");
const utils_1 = require("../../utils/utils");
const createShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { company } = req.params;
        if (!company)
            return res.status(400).json({ message: "Bad request" });
        const services = {
            FEDEX: __1.FEDEXService,
            DHL: __1.DHLService,
            REDPACK: __1.REDPACKService,
            UPS: __1.UPSService,
        };
        const serviceNameMap = {
            FEDEX: sales_model_1.serviceName.FEDEX,
            DHL: sales_model_1.serviceName.DHL,
            REDPACK: sales_model_1.serviceName.REDPACK,
            UPS: sales_model_1.serviceName.UPS,
        };
        const shippingService = services[company];
        const data = yield shippingService.createShipping(req.body);
        const info = yield (0, utils_1.formatShippingResponse)(data, company);
        if (data)
            return res.status(200).json({ shipment: info });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
});
exports.createShipment = createShipment;
const getAllShipments = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getAllShipments = getAllShipments;
