import { Request, Response } from "express";
import turnModel from "../../database/models/turn.model";

export const assignTurn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const turnData = req.body;
    const turn = await turnModel.assign(id, turnData);
    res.status(200).json({ message: "Turn assigned successfully", turn: turn });
  } catch (error) {
    res.status(404).json({ message: "" });
  }
};
