import { Cashier, PrismaClient, Sales } from "@prisma/client";
//import userModel from "../../modules/auth/model";
import prisma from "../prisma";
import { Turn as turnType } from "@prisma/client";
import cashierModel from "./cashier.model";

export type TurnData = {
  startDate?: Date;
  endDate?: Date;
  closeBalance?: number;
  openBalance: number;
  cashierId: string;
  sales?: Sales[];
};

type TurnEndData = {
  id: string;
  TurnData: TurnData;
};

type TurnUpdateData = {
  startDate?: Date;
  endDate?: Date;
  closeBalance?: number;
  openBalance?: number;
  cashierId?: string;
  sales?: Sales[];
};
class Turn {
  constructor(private readonly turn: PrismaClient["turn"]) {}
  async create(turnCreateData: TurnData) {
    const { openBalance, cashierId } = turnCreateData;
    try {
      const newTurn = await this.turn.create({
        data: {
          startDate: new Date(Date.now()),
          endDate: null,
          openBalance: openBalance,
          cashierId: cashierId,
          closeBalance: null,
          sales: undefined,
        },
      });
      if (!newTurn) return null;
      return newTurn;
    } catch (error) {
      throw error;
    }
  }
  async end(id: string, closeBalance: number): Promise<null | turnType> {
    try {
      const turnUpdated = await this.turn.update({
        where: {
          id: id,
        },
        data: {
          endDate: new Date(Date.now()),
          closeBalance: closeBalance,
        },
      });
      if (!turnUpdated) return null;
      return turnUpdated;
    } catch (error: any) {
      return error;
    }
  }

  async get({ id, cashierId }: { id: string; cashierId: string }) {
    try {
      const turn = await this.turn.findUnique({
        where: {
          id: id,
          cashierId: cashierId,
        },
      });
      if (!turn) return null;
      return turn;
    } catch (error) {
      return error;
    }
  }

  async update({}) {}
}

const turnModel = new Turn(prisma.turn);
export default turnModel;
