import express from "express";
import authRouter from "../modules/auth/auth.route";
import ratingRouter from "../modules/rating/rating.route";
import cookieParser from "cookie-parser";
import trackingRouter from "../modules/tracking/tracking.router";
const server = express();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cookieParser());

server.use("/auth", authRouter);
server.use("/rating", ratingRouter);
server.use("/tracking", trackingRouter);
export default server;
