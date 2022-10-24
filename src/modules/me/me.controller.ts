import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import adminModel from "../../database/models/admin.model";
import cashierModel from "../../database/models/cashier.model";
import franchiseModel from "../../database/models/franchise.model";

const userMap = {
  admin: (id: string) => {
    return adminModel.get({ id: id });
  },
  franchise: (id: string) => {
    return franchiseModel.get({ id: id });
  },
  cashier: (id: string) => {
    return cashierModel.get({ id: id });
  },
};
export const getUser = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { id, type } = verify(
    token as string,
    `${process.env.SECRET_KEY_TOKEN}`
  ) as JwtPayload;
  try {
    const data = await userMap[type as keyof typeof userMap](id);
    if (!data) throw new Error("User doesn't exists");
    const { password, ...otherData } = data;
    res.status(200).json({
      message: "User found successfully",
      user: {
        ...otherData,
      },
    });
  } catch (err) {
    res.status(400).json({ message: "Something is wrong!" });
  }
};
