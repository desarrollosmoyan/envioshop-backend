import { Router } from "express";
import onlyAdmin from "../../middleware/onlyAdmin";
import onlyFranchise from "../../middleware/onlyFranchise";
import {
  createACashier,
  createAFranchise,
  createOneAdmin,
  deleteOneCashier,
  deleteOneFranchise,
  getAllCashiers,
  getAllFranchises,
  getOneCashier,
  getOneFranchise,
  getUser,
  updateOneCashier,
  updateOneFranchise,
  getMe,
  getAllCashiersFromOneFranchise,
} from "./user.controller";

const userRouter = Router();

userRouter.post("/admin", createOneAdmin);
userRouter.get("/", getUser);
userRouter.post("/franchise", [onlyAdmin], createAFranchise);
userRouter.get("/franchise", [onlyAdmin], getAllFranchises);
userRouter.get("/franchise/:id", [onlyAdmin], getOneFranchise);
userRouter.delete("/franchise/:id", [onlyAdmin], deleteOneFranchise);
userRouter.put("/franchise/:id", [onlyAdmin], updateOneFranchise);

userRouter.get("/me", getMe);
userRouter.get("/cashier", [onlyFranchise], getAllCashiers);
userRouter.post("/cashier", [onlyFranchise], createACashier);
userRouter.delete("/cashier/:id", [onlyFranchise], deleteOneCashier);
userRouter.put("/cashier/:id", [onlyFranchise], updateOneCashier);
userRouter.get("/cashier/:id", [onlyFranchise], getOneCashier);
export default userRouter;
