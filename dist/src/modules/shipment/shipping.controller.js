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
exports.createShipment = void 0;
const __1 = require("../../..");
const createShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company } = req.params;
        if (!company)
            return res.status(401).json({ message: "Bad request" });
        const services = {
            FEDEX: __1.FEDEXService,
            DHL: __1.DHLService,
            REDPACK: __1.REDPACKService,
            UPS: __1.UPSService,
        };
        const shippingService = services[company];
        console.log(shippingService);
        const data = yield shippingService.createShipping(req.body);
        if (data)
            return res.status(200).json({ shipment: data });
    }
    catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
});
exports.createShipment = createShipment;
