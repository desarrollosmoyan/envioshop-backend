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
exports.getToken = exports.signinHandler = exports.signupHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const utils_1 = require("../../utils/utils");
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, type, } = req.body;
        const newUser = yield (0, utils_1.createUserByType)(data, type);
        if (!newUser)
            return res.status(401).json({ message: "" });
        console.log(newUser);
        res.status(200).send(Object.assign({ message: "User created successfully" }, newUser));
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});
exports.signupHandler = signupHandler;
const signinHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, type } = req.body;
        const isLogged = yield (0, utils_1.loginUserByType)({
            email: email,
            password: password,
        });
        if (!isLogged)
            return res
                .status(400)
                .send({ message: "User credentials are incorrect" });
        res.status(200).json(Object.assign({ message: "User logged successfully" }, isLogged));
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});
exports.signinHandler = signinHandler;
const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = qs_1.default.stringify({
            client_secret: `${process.env.CLIENT_SECRET}`,
            client_id: `${process.env.CLIENT_ID}`,
            grant_type: `${process.env.GRANT_TYPE}`,
        });
        const fedexToken = yield (0, axios_1.default)({
            method: "POST",
            data: data,
            url: "https://apis.fedex.com/oauth/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        res.status(200).json({
            fedex: fedexToken.data,
            dhl: Buffer.from(`${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`).toString("base64"),
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
exports.getToken = getToken;
