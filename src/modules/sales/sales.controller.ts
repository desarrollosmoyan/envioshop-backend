import { Request, Response } from "express";
import prisma from "../../database/prisma";
import { SaleData } from "./sales.types";
export const getAllSales = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const createASale = async (req: Request, res: Response) => {
  try {
    const { franchiseId }: SaleData = req.body;
    const newSale = await saleModel.create({ franchiseId });
  } catch (error) {
    res.status(401).json({ message: "" });
  }
};
