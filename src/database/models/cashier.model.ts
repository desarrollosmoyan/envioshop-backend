import { PrismaClient } from "@prisma/client";
import { encryptPassword, generateToken } from "../../utils/utils";
import prisma from "../prisma";

export type CashierData = {
  name: string;
  password: string;
  email: string;
  franchiseId: string;
};

type CashierUpdateData = {
  id: string;
  data: {
    name?: string;
    password?: string;
    email?: string;
    franchiseId: undefined;
    turnHasEnded?: boolean;
  };
};
class Cashier {
  constructor(private readonly cashier: PrismaClient["cashier"]) {}
  async create(data: CashierData, isTokenRequired: boolean) {
    const { name, password, email, franchiseId } = data;
    const encryptedPassword = await encryptPassword(password);
    const newCashier = await this.cashier.create({
      data: {
        name: name,
        password: encryptedPassword,
        email: email,
        franchise: {
          connect: { id: franchiseId },
        },
      },
    });
    if (!newCashier) return null;
    if (!isTokenRequired) return { ...newCashier, type: "cashier" };
    const token = await generateToken(
      newCashier.id,
      newCashier.email,
      "cashier"
    );
    return { ...newCashier, type: "cashier", token: token };
  }
  async assignFranchise(cashierId: string, franchiseId: string) {
    const cashierUpdated = await this.cashier.update({
      where: {
        id: cashierId,
      },
      data: {
        franchiseId: franchiseId,
      },
    });
    if (!cashierUpdated) return null;
    return cashierUpdated;
  }
  async update(updateData: CashierUpdateData) {
    const { data } = updateData;
    if (data.turnHasEnded) {
      const cashier = await this.cashier.update({
        where: {
          id: updateData.id,
        },
        data: {
          Turn: {
            disconnect: true,
          },
        },
      });
      return cashier;
    }
    const { franchiseId, ...others } = data;
    const updatedCashier = await this.cashier.update({
      where: {
        id: updateData.id,
      },
      data: {
        ...others,
        franchise: {
          connect: { id: data.franchiseId },
        },
      },
    });
    if (!updatedCashier) return null;
    return updatedCashier;
  }
  async get({ id, email }: { id?: string; email?: string }) {
    const cashierFound = id
      ? await this.cashier.findUnique({
          where: { id: id },
          include: {
            Turn: true,
            franchise: {
              select: {
                id: true,
                email: true,
                name: true,
                ubication: true,
              },
            },
          },
        })
      : await this.cashier.findUnique({ where: { email: email } });
    if (!cashierFound) return null;
    return { ...cashierFound, type: "cashier" };
  }

  async getAll([offset = 0, limit = 20]: number[], id: string | undefined) {
    if (id) {
      const cashierList = await this.cashier.findMany({
        skip: offset,
        take: limit,
        where: {
          franchise: {
            id: id,
          },
        },
        select: {
          name: true,
          email: true,
          id: true,
          createdAt: true,
          franchise: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      if (!cashierList) return null;
      return cashierList;
    }
    const cashierList = await this.cashier.findMany({
      skip: offset,
      take: limit,
      select: {
        name: true,
        email: true,
        id: true,
        createdAt: true,
        franchise: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!cashierList) return null;
    return cashierList;
  }

  async delete(id: string) {
    const deletedCashier = await this.cashier.delete({
      where: {
        id: id,
      },
    });
    if (!deletedCashier) return null;
    return deletedCashier;
  }
  async deleteMany(ids: string[]) {
    try {
      const deletedCashiers = await this.cashier.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      if (!deletedCashiers) return null;
      return deletedCashiers;
    } catch (error) {
      throw error;
    }
  }
  async count() {
    return this.cashier.count();
  }
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
      const cashierCount = await this.cashier.count({
        where: {
          ...where,
          createdAt: {
            lte: lte,
            gte: gte,
          },
        },
      });
      if (!cashierCount) return null;
      return cashierCount;
    } catch (error) {
      throw error;
    }
  }
}

const cashierModel = new Cashier(prisma.cashier);

export default cashierModel;
