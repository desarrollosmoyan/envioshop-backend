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
  async getAll([offset = 0, limit = 20]: number[], cityName?: string) {
    let filter;
    console.log(cityName);
    if (cityName) {
      filter = {
        where: {
          ubication: cityName,
        },
      };
    }
    const franchiseList = await this.franchise.findMany({
      skip: offset,
      take: limit,
      ...filter,
      select: {
        id: true,
        name: true,
        email: true,
        ubication: true,
        cellphone: true,
        createdAt: true,
        sales: {
          select: {
            id: true,
          },
        },
        cashiers: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });
    if (!franchiseList) return null;
    return franchiseList;
  }
  async create(data: FranchiseData, isTokenRequired: boolean) {
    const { name, password, email, ubication, cellphone } = data;
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
  async deleteMany(ids: string[]) {
    try {
      const deletedFranchises = await this.franchise.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      if (!deletedFranchises) return null;
      return deletedFranchises;
    } catch (error) {
      throw error;
    }
  }
  async get({ id, email }: { id?: string; email?: string }) {
    console.log("get entro");
    const franchiseFound = id
      ? await this.franchise.findUnique({
          where: { id: id },
          include: {
            cashiers: true,
          },
        })
      : await this.franchise.findUnique({
          where: { email: email },
          include: {
            cashiers: true,
          },
        });
    if (!franchiseFound) return null;
    return { ...franchiseFound, type: "franchise" };
  }
  async count() {
    return this.franchise.count();
  }
  async getBySearch(valueToSearch: string, [offset = 0, limit = 20]: number[]) {
    try {
      console.log(offset, limit);
      let where = {};
      if (valueToSearch.length > 0) {
        where = {
          where: {
            name: {
              contains: valueToSearch,
              mode: "insensitive",
            },
          },
        };
      }
      const franchises = await this.franchise.findMany({
        ...where,
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          ubication: true,
          cellphone: true,
          createdAt: true,
          sales: {
            select: {
              id: true,
            },
          },
          cashiers: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      });
      if (!franchises) return null;
      return franchises;
    } catch (error) {
      throw error;
    }
  }
  async countForDate(lte: Date, gte: Date) {
    try {
      const franchiseCount = await this.franchise.count({
        where: {
          createdAt: {
            lte: lte,
            gte: gte,
          },
        },
      });
      if (!franchiseCount) return null;
      return franchiseCount;
    } catch (error) {
      throw error;
    }
  }
  async getAllFranchiseCities([offset, limit]: number[]) {
    try {
      const list = await this.franchise.findMany({
        skip: offset,
        take: limit,
        select: {
          ubication: true,
        },
      });
      if (!list) return null;
      return list.reduce((acc: any, cur: any, i: any) => {
        const key = "ubication";
        const alreadyExists = acc.find((item: any) => item === cur[key]);
        return alreadyExists ? acc : [...acc, cur[key]];
      }, []);
    } catch (error) {
      throw error;
    }
  }
  async getTopFranchises() {
    try {
      const franchiseList = await this.franchise.findMany({
        where: {
          sales: {
            some: {},
          },
        },
        take: 5,
        select: {
          name: true,
          sales: {
            orderBy: [
              {
                shipmentPrice: "asc",
              },
            ],
          },
        },
      });
      if (!franchiseList) return null;
      return franchiseList;
    } catch (error) {
      throw error;
    }
  }
}

const franchiseModel = new Franchise(prisma.franchise);

export default franchiseModel;
