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
exports.trackASingleShipment = void 0;
const trackASingleShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackingNumber } = req.body;
        //const dhlResponse = await dhlService.getTracking(trackingNumber);
        //const upsResponse = await upsService.getTracking(trackingNumber);
        //const fedexResponse = await fedexService.getTracking(trackingNumber);
        /*console.log(dhlResponse.data);
        console.log(upsResponse.data.trackResponse.shipment[0].package);
        console.log(fedexResponse.data.output.completeTrackResults[0].trackResults);*/
    }
    catch (error) {
        console.log(error);
        console.log({ msg: error.response.data });
    }
});
exports.trackASingleShipment = trackASingleShipment;
