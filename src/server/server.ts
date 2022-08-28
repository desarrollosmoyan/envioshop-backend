import express from "express";
import helloRouter from "../modules/hello/hello.route";

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use("/", helloRouter);
export default server;
