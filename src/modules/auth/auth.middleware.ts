import { Request, Response, NextFunction } from "express";
import prisma from "../../database/prisma";
import { checkIfUsernameOrEmailAlreadyExists } from "../../utils/utils";

const ROLES = ["cashier", "admin", "franchise"];
export const checkExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;
    const userWithSameNameOrSameEmail =
      await checkIfUsernameOrEmailAlreadyExists({ name: name, email: email });
    if (userWithSameNameOrSameEmail) {
      return res
        .status(400)
        .send({ message: "Username or Email already exists" });
    }
    next();
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const checkExistingRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.roles) {
    next();
    return;
  }
  req.body.roles.find();
  for (let i = 0; i < req.body.roles.length; i++) {
    if (!ROLES.includes(req.body.roles[i])) {
      return res.status(400).json({
        message: `Role ${req.body.roles[i]} does not exist`,
      });
    }
  }
  next();
};
