import { Router } from "express";
import { assignTurn } from "./turn.controller";

const turnRouter = Router();

turnRouter.post("/:id", assignTurn);
