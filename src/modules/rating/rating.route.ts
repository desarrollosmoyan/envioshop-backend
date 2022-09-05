import { Router } from "express";
import { checkJWT } from "../../middleware/checkJWT";
import { getRating } from "./rating.controller";

const ratingRouter = Router();

ratingRouter.post("/", [checkJWT], getRating);

export default ratingRouter;
