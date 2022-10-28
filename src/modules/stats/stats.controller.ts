import salesModel from "../../database/models/sales.model";
import { Request, Response } from "express";
import franchiseModel from "../../database/models/franchise.model";
import { getAllCashiers } from "../user/user.controller";
import cashierModel from "../../database/models/cashier.model";
import { decode, JwtPayload } from "jsonwebtoken";
export const getStats = async (req: Request, res: Response) => {
  const payload = decode(req.token as string) as JwtPayload;
  const id = payload.id;
  if (payload.type === "admin") {
    try {
      const today = new Date(Date.now());
      const prevDays = new Date();
      prevDays.setDate(today.getDate() - 7);
      const totalShipments = await salesModel.countForDate(today, prevDays);
      if (!totalShipments) {
        return res.status(400).json({ message: "Something wrong" });
      }

      const totalEarned = await salesModel.countTotalEarned(today, prevDays);
      const totalFranchises = await franchiseModel.countForDate(
        today,
        prevDays
      );
      if (!totalEarned && !totalFranchises)
        return res.status(400).json({ message: "Something wrong" });

      if (!totalShipments) {
        return res.status(400).json({ message: "Something wrong" });
      }
      const totalCashiers = await cashierModel.countForDate(today, prevDays);

      const recentShipments = await salesModel.getRecentShipments(
        today,
        prevDays
      );
      const topFranchises = await franchiseModel.getTopFranchises();
      if (!topFranchises) throw new Error("error");
      res.status(200).json({
        message: "Stats getted successfully",
        totalCashiers: totalCashiers,
        totalFranchises: totalFranchises,
        totalShipments: totalShipments,
        totalEarned: totalEarned,
        recentShipments: recentShipments,
        topFranchises: topFranchises,
      });
    } catch (err: any) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  } else {
    try {
      const payload = decode(req.token as string) as JwtPayload;
      const id = payload.id;
      const today = new Date(Date.now());
      const prevDays = new Date();
      prevDays.setDate(today.getDate() - 7);
      const totalEarned = await salesModel.countTotalEarned(
        today,
        prevDays,
        id as string
      );
      const totalShipments = await salesModel.countForDate(
        today,
        prevDays,
        id as string
      );
      const totalCashiers = await cashierModel.countForDate(
        today,
        prevDays,
        id as string
      );
      const recentShipments = await salesModel.getRecentShipments(
        today,
        prevDays,
        id as string
      );
      const topFranchises = await franchiseModel.getTopFranchises();
      res.status(200).json({
        message: "Stats getted successfully",
        totalCashiers: totalCashiers,
        totalShipments: totalShipments,
        totalEarned: totalEarned,
        recentShipments: recentShipments,
        topFranchises: topFranchises,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error something happened" });
    }
  }
};

export const getStatsFromOneFranchise = async (req: Request, res: Response) => {
  try {
    const payload = decode(req.token as string) as JwtPayload;
    const id = payload.id;
    const today = new Date(Date.now());
    const prevDays = new Date();
    prevDays.setDate(today.getDate() - 7);
    const totalEarned = await salesModel.countTotalEarned(
      today,
      prevDays,
      id as string
    );
    const totalShipments = await salesModel.countForDate(
      today,
      prevDays,
      id as string
    );
    const totalCashiers = await cashierModel.countForDate(
      today,
      prevDays,
      id as string
    );
    const topFranchises = await franchiseModel.getTopFranchises();
    res.status(200).json({
      message: "Stats getted successfully",
      totalCashiers: totalCashiers,
      totalShipments: totalShipments,
      totalEarned: totalEarned,
      topFranchises: topFranchises,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error something happened" });
  }
};
