import salesModel from "../../database/models/sales.model";
import { Request, Response } from "express";
const getStats = async (req: Request, res: Response) => {
  const today = new Date(Date.now());
  const prevDays = new Date();
  prevDays.setDate(today.getDate() - 7);
  const totalShipments = await salesModel.getOneFromDate(today, prevDays);
  if (!totalShipments) {
    return res.status(400).json({ message: "Something wrong" });
  }
};
