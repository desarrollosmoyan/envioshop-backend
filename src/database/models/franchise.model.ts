import { PrismaClient } from "@prisma/client";
import { encryptPassword } from "../../utils/utils";
import prisma from "../prisma";
import { generateToken } from "../../utils/utils";

export interface FranchiseData {
  name: string;
  password: string;
  email: string;
  ubication: string;
  cellphone: string;
  sales: undefined;
  cashiers: undefined;
}

interface FranchiseUpdateData {
  id: string;
  data: {
    name?: string;
    password?: string;
    email?: string;
    ubication?: string;
    sales?: undefined;
    cashiers?: undefined;
  };
}
class Franchise {
  constructor(private readonly franchise: PrismaClient["franchise"]) {}
  async getAll() {
    const franchiseList = await this.franchise.findMany();
    if (!franchiseList) return null;
    return franchiseList;
  }
  async create(data: FranchiseData, isTokenRequired: boolean) {
    const { name, password, email, ubication, cellphone } = data;
    console.log(data);
    const encryptedPassword = await encryptPassword(password);
    try {
      const newFranchise = await this.franchise.create({
        data: {
          name: name,
          password: encryptedPassword,
          email: email,
          cellphone: cellphone,
          ubication: ubication,
          sales: undefined,
          cashiers: undefined,
        },
      });
      if (!newFranchise) return null;
      if (!isTokenRequired) return { ...newFranchise, type: "franchise" };
      const token = await generateToken(
        newFranchise.id,
        newFranchise.email,
        newFranchise.password,
        "franchise"
      );
      return { ...newFranchise, type: "franchise", token: token };
    } catch (error) {
      console.log(error);
    }
  }
  async update(updateData: FranchiseUpdateData) {
    const { id, data } = updateData;
    const updatedFranchise = await this.franchise.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
    if (!updatedFranchise) return null;
    return updatedFranchise;
  }
  async delete(id: string) {
    const deletedFranchise = await this.franchise.delete({
      where: {
        id: id,
      },
    });
    if (!deletedFranchise) return null;
    return deletedFranchise;
  }
  async get({ id, email }: { id?: string; email?: string }) {
    const franchiseFound = id
      ? await this.franchise.findUnique({ where: { id: id } })
      : await this.franchise.findUnique({ where: { email: email } });
    if (!franchiseFound) return null;
    return { ...franchiseFound, type: "franchise" };
  }
}

const franchiseModel = new Franchise(prisma.franchise);

export default franchiseModel;
