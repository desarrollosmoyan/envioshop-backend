import { Request, Response } from "express";
import cashierModel from "../../database/models/cashier.model";
import turnModel, { TurnData } from "../../database/models/turn.model";
export const assignTurn = async (req: Request, res: Response) => {
  try {
    const { cashierId, openBalance }: TurnData = req.body;
    const turn = await turnModel.create({ cashierId, openBalance });
    if (!turn) return res.status(401).json({ message: "Can't create turn" });
    res.status(200).json({ turn: turn, message: "Turn created successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something is wrong" });
  }
};

export const endTurn = async (req: Request, res: Response) => {
  try {
    const { turnId, closeBalance } = req.body;
    const turn = await turnModel.end(turnId, closeBalance);
    if (!turn) return res.status(401).json({ message: "Can't end turn" });
    cashierModel.update({
      id: turn.cashierId,
      data: {
        currentTurn: undefined,
      },
    });
    res.status(200).json({ turn: turn, message: "Turn ended successfully" });
  } catch (error) {
    res.status(404).json({ message: "" });
  }
};
