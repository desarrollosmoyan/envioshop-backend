import { Router } from "express";
import { assignTurn, endTurn } from "./turn.controller";

const turnRouter = Router();

turnRouter.post("/:id", assignTurn);
turnRouter.put("/:id", endTurn);
export default turnRouter;
