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
const model_1 = __importDefault(require("./model"));
const model_2 = require("./model");
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, name, email } = req.body;
        const newUser = yield model_1.default.signup({
            name: name,
            email: email,
            password: password,
            role: model_2.roleName.admin,
            ubication: undefined,
        });
        res.status(200).send({
            message: "User created successfully",
            user: Object.assign({}, newUser),
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});
exports.signupHandler = signupHandler;
const signinHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isLogged = yield model_1.default.signin({
            email: email,
            password: password,
        });
        if (isLogged)
            return res
                .status(200)
                .send({ message: "User logged successfully", user: isLogged });
        return res.status(400).send({ message: "User credentials are incorrect" });
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
