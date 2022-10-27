"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getAllShipments = exports.createShipment = void 0;
const axios_1 = __importDefault(require("axios"));
const __1 = require("../../..");
const sales_model_1 = __importStar(require("../../database/models/sales.model"));
const utils_1 = require("../../utils/utils");
const createShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company } = req.params;
        const { franchiseId, turnId, shipmentPrice } = req.body;
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
        console.log(req.body);
        if (info.document.type === "ZPL") {
            const { data } = yield (0, axios_1.default)({
                method: "POST",
                responseEncoding: "binary",
                responseType: "arraybuffer",
                url: "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
                data: info.document.content,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/pdf",
                },
            });
            const base64 = Buffer.from(data).toString("base64");
            info.document.content = base64;
            info.document.type = "PDF";
        }
        const newSale = yield sales_model_1.default.create({
            serviceName: serviceNameMap[company],
            serviceType: info.service.name,
            shipmentDescription: "",
            shipmentPrice: parseFloat(shipmentPrice),
            shipmentPdf: info.document.content,
            shipper: {
                postalCode: info.package.originZipCode,
            },
            receiver: {
                postalCode: info.package.destinyZipCode,
            },
            franchiseId: franchiseId,
            turnId: turnId,
            shipmentTrackingNumber: info.package.trackingNumber,
        });
        if (data)
            return res.status(200).json({ shipment: info });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
});
exports.createShipment = createShipment;
const getAllShipments = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getAllShipments = getAllShipments;
