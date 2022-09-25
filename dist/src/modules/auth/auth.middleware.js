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
exports.checkExistingRole = exports.checkExistingUser = void 0;
const ROLES = ["cashier", "admin", "franchise"];
const checkExistingUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*const { name, email } = req.body;
        const userWithSameNameOrSameEmail =
          await checkIfUsernameOrEmailAlreadyExists({ name: name, email: email });
        if (userWithSameNameOrSameEmail) {
          return res
            .status(400)
            .send({ message: "Username or Email already exists" });
        }
        next();
        */
        next();
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.checkExistingUser = checkExistingUser;
const checkExistingRole = (req, res, next) => {
    if (!req.body.roles) {
        next();
        return;
    }
    req.body.roles.find();
    for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
            return res.status(400).json({
                message: `Role ${req.body.roles[i]} does not exist`,
            });
        }
    }
    next();
};
exports.checkExistingRole = checkExistingRole;
