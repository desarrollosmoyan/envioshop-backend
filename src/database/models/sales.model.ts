import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";

class Sales {
  constructor(private readonly sale: PrismaClient["sales"]) {}
  async create() {}
  async get() {}
  async getAll() {}
}

const salesModel = new Sales(prisma.sales);
