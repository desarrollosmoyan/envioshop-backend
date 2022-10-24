import express from "express";
import authRouter from "../modules/auth/auth.route";
import cookieParser from "cookie-parser";
const cors = require("cors");
import mainRouter from "./router";
import { checkJWT } from "../middleware/checkJWT";

const server = express();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());
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
server.use("/auth", authRouter);
server.use("/", [checkJWT], mainRouter);
export default server;
