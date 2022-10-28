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
exports.updateURLS = exports.getURLS = void 0;
const fs_1 = require("fs");
const getURLS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rawData = yield fs_1.promises.readFile('./src/data/settings.json', 'binary');
    if (!rawData)
        return res.json({
            fedex: 'https://apis.fedex.com',
            dhl: 'https://express.api.dhl.com/mydhlapi/test',
            ups: 'https://wwwcie.ups.com',
        });
    const data = JSON.parse(rawData);
    return res.json(data);
});
exports.getURLS = getURLS;
const updateURLS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rawData = yield fs_1.promises.readFile('./src/data/settings.json', 'binary');
    if (!rawData || !req.body)
        return res.json({
            fedex: 'https://apis.fedex.com',
            dhl: 'https://express.api.dhl.com/mydhlapi/test',
            ups: 'https://wwwcie.ups.com',
        });
    yield fs_1.promises.writeFile('./src/data/settings.json', JSON.stringify(req.body));
    return res.json(req.body);
});
exports.updateURLS = updateURLS;
