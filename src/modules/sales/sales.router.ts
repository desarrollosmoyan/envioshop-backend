import { Router } from "express";
import {
  getAllSales,
  createOneSale,
  getOneSale,
  getSalesCount,
  getFranchisesWithSales,
} from "./sales.controller";
const salesRouter = Router();

salesRouter.get("/", getAllSales);
salesRouter.post("/", createOneSale);
salesRouter.post("/franchises", getFranchisesWithSales);
salesRouter.get("/:id", getOneSale);

export default salesRouter;
