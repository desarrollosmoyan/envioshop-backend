import { Cashier, PrismaClient, Sales } from "@prisma/client";
import userModel from "../../modules/auth/model";
import prisma from "../prisma";

type TurnData = {
  startDate: Date;
  endDate: null;
  openBalance: number;
  sales: Sales[];
  cashierId?: string;
  cashier?: Cashier;
};

type TurnEndData = {
  id: string;
  TurnData: TurnData;
};

class Turn {
  constructor(private readonly turn: PrismaClient["turn"]) {}
  async create(turnData: TurnData): Promise<void | Error> {
    try {
      const { startDate, endDate, openBalance, cashierId } = turnData;
      const newTurn = await this.turn.create({
        data: {
          startDate: startDate,
          endDate: endDate,
          openBalance: openBalance,
          cashierId: !cashierId ? "" : cashierId,
        },
      });
      if (!newTurn) throw Error("Can't create turn");
    } catch (error) {
      throw Error("Can't create turn");
    }
  }
  async end(id: string, closeBalance: number) {
    try {
      const currentTurn = await this.turn.update({
        where: {
          id: id,
        },
        data: {
          endDate: new Date(Date.now()),
          closeBalance: closeBalance,
        },
      });
      if (!currentTurn) throw Error("Can't end turn");
      return currentTurn;
    } catch (error) {
      throw Error("Can't end turn");
    }
  }
  async assign(id: string, turnData: TurnData) {
    try {
      const user = await userModel.getUser({ id: id });
      if (!user) throw new Error("Can't assing turn to current user");
      if (user.cashierId) {
        const newTurn = await this.create(turnData);
        return newTurn;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteTurn(id: string) {
    try {
    } catch (error) {}
  }
}

const turnModel = new Turn(prisma.turn);

export default turnModel;
