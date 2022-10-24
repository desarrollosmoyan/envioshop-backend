import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import adminModel from "../database/models/admin.model";
import cashierModel from "../database/models/cashier.model";
import franchiseModel from "../database/models/franchise.model";
import prisma from "../database/prisma";
import { selectUserByRoleAndReturn } from "../utils/utils";

const allowedRoles = {
  admin: true,
  cashier: true,
  franchise: false,
};

export const checkJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization)
    return res.status(401).send({ message: "Non token found" });
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "Non token found" });
  }
  let payload;
  try {
    payload = jwt.verify(token, `${process.env.SECRET_KEY_TOKEN}`);
    req.token = token;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.log(err);
      return res.status(401).send({ message: "Unauthorized" });
    }
    return res.status(400).send({ message: "Error" });
  }
  if (payload) {
    next();
    return;
  }
  /* const roleName = (payload as JwtPayload).type;
  if (allowedRoles[roleName as keyof typeof allowedRoles]) {
    next();
    return;
  }*/
  return res.status(403).json({ message: "Unauthorized" });
};
