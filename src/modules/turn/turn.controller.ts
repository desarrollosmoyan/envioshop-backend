import { Request, Response } from "express";
import cashierModel from "../../database/models/cashier.model";
import turnModel, { TurnData } from "../../database/models/turn.model";
export const assignTurn = async (req: Request, res: Response) => {
  try {
    const cashierId = req.params.id;
    const { openBalance }: TurnData = req.body;
    const turn = await turnModel.create({ cashierId, openBalance });
    if (!turn) return res.status(401).json({ message: "Can't create turn" });
    res.status(200).json({ turn: turn, message: "Turn created successfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something is wrong" });
  }
};

export const endTurn = async (req: Request, res: Response) => {
  try {
    const turnId = req.params.id;
    const { closeBalance } = req.body;
    const turn = await turnModel.end(turnId, closeBalance);
    if (!turn) return res.status(401).json({ message: "Can't end turn" });
    res.status(200).json({ turn: turn, message: "Turn ended successfully" });
  } catch (error) {
    res.status(404).json({ message: "" });
  }
};

export const updateTurn = async (req: Request, res: Response) => {
  try {
    const turnId = req.params.id;
    const body = req.body;
    const turnUpdated = await turnModel.update(turnId, body);
    if (!turnUpdated) throw new Error("Something is wrong");
    res
      .status(200)
      .json({ message: "Turn updated successfully", turn: turnUpdated });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
