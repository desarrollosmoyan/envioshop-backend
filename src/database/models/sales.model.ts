import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";

enum serviceName {
  FEDEX = "FEDEX",
  DHL = "DHL",
  REDPACK = "REDPACK",
  ESTAFETA = "ESTAFETA",
  UPS = "UPS",
}
type SalesData = {
  serviceName: serviceName;
  serviceType: string;
  shipmentPrice: number;
  shipmentPdf: string;
  franchiseId: string;
  turnId: string;
};
class Sales {
  constructor(private readonly sale: PrismaClient["sales"]) {}
  async create(data: SalesData) {
    try {
      const newSale = await this.sale.create({
        data: {
          ...data,
        },
      });
      if (!newSale) return null;
      return newSale;
    } catch (error) {}
  }
  async get() {}
  async getAll() {}
}

const salesModel = new Sales(prisma.sales);
