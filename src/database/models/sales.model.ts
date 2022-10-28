import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../prisma";

export enum serviceName {
  FEDEX = "FEDEX",
  DHL = "DHL",
  REDPACK = "REDPACK",
  ESTAFETA = "ESTAFETA",
  UPS = "UPS",
  PAQUETEEXPRESS = "PAQUETEEXPRESS",
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
  async getAll(
    [offset, limit]: number[],
    svcName?: serviceName,
    lte?: Date,
    gte?: Date
  ) {
    try {
      let where;
      if (serviceName) {
        where = {
          where: {
            serviceName: svcName,
          },
        };
      }
      console.log(lte, gte);
      if (lte && gte) {
        where = {
          where: {
            ...where?.where,
            createdAt: {
              lte: lte,
              gte: gte,
            },
          },
        };
      }
      console.log(where);
      const saleList = await this.sale.findMany({
        skip: offset,
        take: limit,
        ...where,
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
  async countForDate(lte: Date, gte: Date, id?: string) {
    try {
      let where;
      if (id) {
        where = {
          franchise: {
            id: id,
          },
        };
      }
      const saleList = await this.sale.count({
        where: {
          ...where,
          franchise: {
            id: id,
          },
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

  async count(franchiseId: string | null) {
    try {
      let saleList;
      if (franchiseId) {
        saleList = await this.sale.count({
          where: {
            franchiseId: franchiseId,
          },
        });
      } else {
        saleList = await this.sale.count({});
      }
      if (!saleList) return null;
      return saleList;
    } catch (error) {
      throw error;
    }
  }
  async countTotalEarned(lte: Date, gte: Date, id?: string) {
    try {
      let where;
      if (id) {
        where = {
          franchise: {
            id: id,
          },
        };
      }
      const totalEarned = await this.sale.findMany({
        where: {
          ...where,
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

  async getRecentShipments(lte: Date, gte: Date, id?: string) {
    try {
      let where;
      if (id) {
        where = {
          franchise: {
            id: id,
          },
        };
      }
      const saleList = await this.sale.findMany({
        where: {
          ...where,
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

  async getFranchisesWithShipments([offset = 0, limit = 20]: number[]) {
    try {
      const list = await this.sale.findMany({
        take: limit,
        skip: offset,
        select: {
          franchise: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      if (!list) return null;
      return list;
    } catch (error) {
      throw error;
    }
  }
}

const salesModel = new Sales(prisma.sales);
export default salesModel;
