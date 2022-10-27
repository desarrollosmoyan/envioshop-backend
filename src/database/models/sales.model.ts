import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../prisma";

export enum serviceName {
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
  shipmentDescription: string;
  shipmentTrackingNumber: string;
  shipper: Prisma.JsonObject;
  receiver: Prisma.JsonObject;
  shipmentPdf: string;
  franchiseId: string;
  turnId: string;
};
class Sales {
  constructor(private readonly sale: PrismaClient["sales"]) {}
  async create(data: SalesData) {
    try {
      const { franchiseId, turnId, ...newData } = data;
      console.log(data);
      const newSale = await this.sale.create({
        data: {
          ...newData,
          franchise: {
            connect: {
              id: franchiseId,
            },
          },
          Turn: {
            connect: { id: turnId },
          },
        },
      });
      if (!newSale) return null;
      return newSale;
    } catch (error) {
      throw error;
    }
  }
  async get(id: string) {
    try {
      const sale = await this.sale.findUnique({
        where: {
          id: id,
        },
      });
      if (!sale) return null;
      return sale;
    } catch (error) {
      throw error;
    }
  }
  async getAll([offset, limit]: number[]) {
    try {
      const saleList = await this.sale.findMany({
        skip: offset,
        take: limit,
        include: {
          franchise: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          Turn: {
            select: {
              id: true,
              createdAt: true,
              cashier: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      if (!saleList) return null;
      return saleList;
    } catch (error) {
      throw error;
    }
  }
  async deleteOne() {}
  async countForDate(lte: Date, gte: Date) {
    try {
      const saleList = await this.sale.count({
        where: {
          createdAt: {
            lte: lte,
            gte: gte,
          },
        },
      });
      if (!saleList) return null;
      return saleList;
    } catch (error) {
      throw error;
    }
  }
  async countTotalEarned(lte: Date, gte: Date) {
    try {
      const totalEarned = await this.sale.findMany({
        where: {
          createdAt: {
            lte: lte,
            gte: gte,
          },
        },
        select: {
          shipmentPrice: true,
        },
      });
      const total = totalEarned.map((item) => Object.values(item)[0]);
      return total.reduce((prev, current) => prev + current, 0);
    } catch (error) {
      throw error;
    }
  }

  async getRecentShipments(lte: Date, gte: Date) {
    try {
      const saleList = await this.sale.findMany({
        where: {
          createdAt: {
            lte: lte,
            gte: gte,
          },
        },
        include: {
          franchise: {
            select: {
              name: true,
            },
          },
          Turn: {
            select: {
              cashier: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        take: 5,
      });
      if (!saleList) return null;
      return saleList;
    } catch (error) {
      throw error;
    }
  }
}

const salesModel = new Sales(prisma.sales);
export default salesModel;
