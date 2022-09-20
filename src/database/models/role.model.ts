import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";

enum roleName {
  admin = "admin",
  franchise = "franchise",
  cashier = "cashier",
}

type AssingRole = {
  franchiseId?: string;
  ubication?: string;
  cashierId?: string;
};
class Role {
  constructor(private readonly role: PrismaClient["role"]) {}
  async assignRole(type: roleName) {
    try {
      const role = await this.role.findFirst({
        where: {
          name: type,
        },
      });
      if (!role) throw new Error("Can't find role");
      return role;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const roleModel = new Role(prisma.role);
export default roleModel;
