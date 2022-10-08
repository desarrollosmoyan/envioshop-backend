import express from "express";
import { Response, Request } from "express";
import authRouter from "../modules/auth/auth.route";
import ratingRouter from "../modules/rating/rating.route";
import cookieParser from "cookie-parser";
import trackingRouter from "../modules/tracking/tracking.router";
import userRouter from "../modules/user/user.route";
import shippingRouter from "../modules/shipment/shipping.route";
const cors = require("cors");
import axios from "axios";

const server = express();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());
server.use(cors());

server.use("/shipping", shippingRouter);
server.use("/auth", authRouter);
server.use("/rating", ratingRouter);
server.use("/tracking", trackingRouter);
server.use("/user", userRouter);
server.use("/test", async (req: Request, res: Response) => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", "FENVIOSHOP");
    params.append("password", "Envioshop.22");
    const { data } = await axios({
      method: "POST",
      url: "https://api.redpack.com.mx/oauth/token",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic YXBwLXJlZHBhY2std2ViOlIzZFBhY2smMjAyMA==`,
      },
      data: params,
    });
    console.log(data);
  } catch (error: any) {
    console.log(error);
    console.log(error.response);
  }
});
export default server;
