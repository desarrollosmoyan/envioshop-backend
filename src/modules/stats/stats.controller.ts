import salesModel from "../../database/models/sales.model";
import { Request, Response } from "express";
import franchiseModel from "../../database/models/franchise.model";
import { getAllCashiers } from "../user/user.controller";
import cashierModel from "../../database/models/cashier.model";
export const getStats = async (req: Request, res: Response) => {
  try {
    const today = new Date(Date.now());
    const prevDays = new Date();
    prevDays.setDate(today.getDate() - 7);
    const totalShipments = await salesModel.countForDate(today, prevDays);
    if (!totalShipments) {
      return res.status(400).json({ message: "Something wrong" });
    }

    const totalEarned = await salesModel.countTotalEarned(today, prevDays);
    const totalFranchises = await franchiseModel.countForDate(today, prevDays);
    if (!totalEarned && !totalFranchises)
      return res.status(400).json({ message: "Something wrong" });

    if (!totalShipments) {
      return res.status(400).json({ message: "Something wrong" });
    }
    const totalCashiers = await cashierModel.countForDate(today, prevDays);
    /* const arrOfPromises = await Promise.all([
      totalShipments,
      totalEarned,
      totalFranchises,
      totalCashiers,
    ]);
    const filtered = arrOfPromises.map((e) => {
      if (!e) {
        return res.status(400).json({ message: "Something wrong" });
      }
      return e;
    });*/
    const recentShipments = await salesModel.getAll([0, 50]);
    res.status(200).json({
      message: "Stats getted successfully",
      totalCashiers: totalCashiers,
      totalFranchises: totalFranchises,
      totalShipments: totalShipments,
      totalEarned: totalEarned,
      recentShipments: recentShipments,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
