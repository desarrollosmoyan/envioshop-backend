import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import prisma from "../../database/prisma";

const ROLES = ["cashier", "admin", "franchise"];
export const checkExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email }: User = req.body;
    const hasUserWithSameName = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    if (hasUserWithSameName) {
      return res.status(400).send({ message: "Your username already exists" });
    }
    const hasUserWithSameEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (hasUserWithSameEmail) {
      return res
        .status(400)
        .send({ message: "Your email has another account linked" });
    }
    next();
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

/* 
    
*/
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
