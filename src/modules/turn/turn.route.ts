import { Router } from "express";
import { assignTurn, endTurn, updateTurn } from "./turn.controller";

const turnRouter = Router();

turnRouter.post("/:id", assignTurn);
turnRouter.put("/:id", endTurn);
turnRouter.patch("/:id", updateTurn);
export default turnRouter;
