import { Router } from "express";
import { checkJWT } from "../../middleware/checkJWT";
import { getUser } from "./me.controller";
const meRouter = Router();

meRouter.get("/", [checkJWT], getUser);

export default meRouter;
