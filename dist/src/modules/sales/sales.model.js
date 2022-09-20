"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*class Sales {
  constructor(private readonly model: PrismaClient["sales"]) {}

  async create(data: SaleData) {
    try {
      const franchise = await franchiseModel.getUser({ id: data.franchiseId });
      if (!franchise) return new Error("Franchise doesn't exists");
      const newSale = await this.model.create({
        data: {
          franchiseId: franchise.id,
        },
      });
      if (!newSale) return new Error("Can't create sale");
    } catch (error: any) {
      return error;
    }
  }
  async update(updateData: SaleUpdateData) {}
  async getAllSales(id: string) {}
}

const saleModel = new Sales(prisma.sales);
export default saleModel;
*/
