import { PrismaClient } from "@prisma/client";
import { encryptPassword, generateToken } from "../../utils/utils";
import prisma from "../prisma";

export type AdminData = {
  name: string;
  email: string;
  password: string;
};
class Admin {
  constructor(private readonly admin: PrismaClient["admin"]) {}
  async create(data: AdminData) {
    const { name, email, password } = data;
    const encryptedPassword = await encryptPassword(password);
    const newAdmin = await this.admin.create({
      data: {
        name: name,
        email: email,
        password: encryptedPassword,
      },
    });
    const token = await generateToken(newAdmin.id, newAdmin.email, "admin");
    if (!newAdmin) return null;
    return { ...newAdmin, token: token };
  }
  async get({ id, email }: { id?: string; email?: string }) {
    const adminFound = id
      ? await this.admin.findUnique({ where: { id: id } })
      : await this.admin.findUnique({ where: { email: email } });
    if (!adminFound) return null;
    return { ...adminFound, type: "admin" };
  }
  async update() {}
}

const adminModel = new Admin(prisma.admin);

export default adminModel;
