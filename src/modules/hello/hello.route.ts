import { Router } from "express";
import { hello } from "./hello.controller";

const helloRouter = Router();

helloRouter.get("/", hello);

export default helloRouter;
