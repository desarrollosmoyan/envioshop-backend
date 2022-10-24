import { Router } from "express";
import { getStats } from "./stats.controller";
const statsRouter = Router();

statsRouter.get("/", getStats);

export default statsRouter;
