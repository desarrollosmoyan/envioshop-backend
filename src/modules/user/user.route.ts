import { Router } from "express";
import { getAllUsers, updateUser } from "./user.controller";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.patch("/:id", updateUser);
export default userRouter;
