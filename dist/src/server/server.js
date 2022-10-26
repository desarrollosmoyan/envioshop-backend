"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors = require("cors");
const router_1 = __importDefault(require("./router"));
const checkJWT_1 = require("../middleware/checkJWT");
const server = (0, express_1.default)();
server.use(express_1.default.urlencoded({ extended: false }));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
server.use(cors());
/*server.use("/shipping", shippingRouter);
server.use("/auth", authRouter);
server.use("/rating", ratingRouter);
server.use("/tracking", trackingRouter);
server.use("/user", userRouter);
server.use("/turn", turnRouter);
server.use("/sales", salesRouter);
server.use("/me", meRouter);
server.use("/test", async (req: Request, res: Response) => {});*/
server.use("/auth", auth_route_1.default);
server.use("/", [checkJWT_1.checkJWT], router_1.default);
exports.default = server;
