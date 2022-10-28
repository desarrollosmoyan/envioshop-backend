import { Router } from "express";
import {
  getAllSales,
  createOneSale,
  getOneSale,
  getSalesCount,
} from "./sales.controller";
const salesRouter = Router();

salesRouter.get("/", getAllSales);
salesRouter.post("/", createOneSale);
salesRouter.get("/:id", getOneSale);

export default salesRouter;
