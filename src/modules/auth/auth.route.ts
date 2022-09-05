import { Router } from "express";
import { getToken, signinHandler, signupHandler } from "./auth.controller";
import { checkExistingUser } from "./auth.middleware";

const authRouter = Router();

authRouter.post("/signin", signinHandler);
authRouter.post("/signup", [checkExistingUser], signupHandler);
authRouter.get("/token", getToken);
export default authRouter;
