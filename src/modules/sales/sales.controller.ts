import { Request, Response } from "express";
import salesModel from "../../database/models/sales.model";
import prisma from "../../database/prisma";
import { SaleData } from "./sales.types";

export const createOneSale = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const sale = await salesModel.create(data);
    if (!sale) return res.status(400).json({ message: "Can't create sale" });
    res.status(200).json({ message: "Sale created successfully", sale: sale });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllSales = async (req: Request, res: Response) => {
  try {
    const { offset, limit, cashierDetails } = req.query;
    const salesList = await salesModel.getAll([
      parseInt(offset as string),
      parseInt(limit as string),
    ]);
    if (!salesList)
      return res.status(400).json({ message: "can't get sale list" });
    res.status(200).json({ salesList: salesList });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOneSale = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const sale = await salesModel.get(id);
    if (!sale) return res.status(400).json({ message: " Can't get sale" });
    res.status(200).json({ sale: sale });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
