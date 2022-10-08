import { Router } from "express";
import {
  createACashier,
  createAFranchise,
  createOneAdmin,
  deleteOneFranchise,
  getAllCashiers,
  getAllFranchises,
} from "./user.controller";

const userRouter = Router();

userRouter.post("/admin", createOneAdmin);
userRouter.post("/franchise", createAFranchise);
userRouter.get("/franchise", getAllFranchises);
userRouter.delete("/franchise/:id", deleteOneFranchise);
userRouter.get("/cashier", getAllCashiers);
userRouter.post("/cashier", createACashier);
export default userRouter;
