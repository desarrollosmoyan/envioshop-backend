import { Router } from "express";
import { getStats, getStatsFromOneFranchise } from "./stats.controller";
const statsRouter = Router();

statsRouter.get("/", getStats);
statsRouter.get("/franchise", getStatsFromOneFranchise);
export default statsRouter;
