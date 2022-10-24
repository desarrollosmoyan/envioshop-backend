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
exports.checkJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const allowedRoles = {
    admin: true,
    cashier: true,
    franchise: false,
};
const checkJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization)
        return res.status(401).send({ message: "Non token found" });
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send({ message: "Non token found" });
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY_TOKEN}`);
        req.token = token;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log(err);
            return res.status(401).send({ message: "Unauthorized" });
        }
        return res.status(400).send({ message: "Error" });
    }
    if (payload) {
        next();
        return;
    }
    /* const roleName = (payload as JwtPayload).type;
    if (allowedRoles[roleName as keyof typeof allowedRoles]) {
      next();
      return;
    }*/
    return res.status(403).json({ message: "Unauthorized" });
});
exports.checkJWT = checkJWT;
