import { Request, Response } from "express";
import salesModel, { serviceName } from "../../database/models/sales.model";
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
    const { offset, limit } = req.query;
    let svcName;
    let lte;
    let gte;
    console.log(req.query);
    if (req.query.serviceName) {
      svcName = serviceName[req.query.serviceName as keyof typeof serviceName];
    }
    if (req.query.lte && req.query.gte) {
      lte = new Date(req.query.lte as string);
      gte = new Date(req.query.gte as string);
    }
    const salesList = await salesModel.getAll(
      [parseInt(offset as string), parseInt(limit as string)],
      svcName,
      lte,
      gte
    );
    const count = await salesModel.count(null);
    if (!salesList) {
      return res.status(400).json({ message: "can't get sale list" });
    }
    res.status(200).json({ salesList: salesList, count: count });
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

export const getSalesCount = async (req: Request, res: Response) => {
  try {
    const id = req.body.id ? req.body.id : null;
    const count = await salesModel.count(id);
    if (!count) throw new Error("Error");
    res.status(200).json({ count: count });
  } catch (error) {
    res.status(400).json({ message: "Something is wrong" });
  }
};

export const getFranchisesWithSales = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const list = await salesModel.getFranchisesWithShipments([
      parseInt(offset as string),
      parseInt(limit as string),
    ]);
    if (!list) throw new Error("Something wrong");
    const returnedList = list
      .map((item) => item.franchise)
      .reduce((acc: any, cur: any, i: any) => {
        const key = "name";
        const alreadyExists = acc.find((item: any) => item.name === cur.name);
        return alreadyExists ? acc : [...acc, cur];
      }, []);
    res.status(200).json({
      message: "Successfully request",
      franchises: returnedList,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something is wrong" });
  }
};
