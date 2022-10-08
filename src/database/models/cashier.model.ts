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
    franchiseId?: string;
    currentTurn?: string;
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
        franchiseId: franchiseId,
      },
    });
    if (!newCashier) return null;
    if (!isTokenRequired) return { ...newCashier, type: "cashier" };
    const token = await generateToken(
      newCashier.id,
      newCashier.email,
      newCashier.password,
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
    const updatedCashier = await this.cashier.update({
      where: {
        id: updateData.id,
      },
      data: {
        ...data,
      },
    });
    if (!updatedCashier) return null;
    return updatedCashier;
  }
  async get({ id, email }: { id?: string; email?: string }) {
    const cashierFound = id
      ? await this.cashier.findUnique({ where: { id: id } })
      : await this.cashier.findUnique({ where: { email: email } });
    if (!cashierFound) return null;
    return { ...cashierFound, type: "cashier" };
  }

  async getAll() {
    const cashierList = await this.cashier.findMany();
    if (!cashierList) return null;
    return cashierList;
  }
}

const cashierModel = new Cashier(prisma.cashier);

export default cashierModel;
