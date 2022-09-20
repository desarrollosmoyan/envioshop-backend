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
exports.getRating = void 0;
const __1 = require("../../..");
const utils_1 = require("../../utils/utils");
const getRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DHLRating = yield __1.DHLService.getRating(req.body);
        const FEDEXRating = yield __1.FEDEXService.getRating(req.body);
        const UPSRating = yield __1.UPSService.getRating(req.body);
        const REDPACKRating = yield __1.REDPACKService.getRating(req.body);
        const ESTAFETARating = yield __1.ESTAFETAService.getRating(req.body);
        const p = yield (yield __1.redisConnection).get("FEDEXTOKEN");
        const dataToFormat = [DHLRating, UPSRating, FEDEXRating];
        const dataFormated = [
            ...(0, utils_1.formatRatingResponse)(dataToFormat),
            ESTAFETARating,
        ].flatMap((element) => element);
        res.status(200).json({
            message: "Rating maked successfully",
            data: dataFormated,
        });
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
    }
});
exports.getRating = getRating;
