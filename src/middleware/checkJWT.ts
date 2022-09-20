import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import prisma from "../database/prisma";
import userModel from "../modules/auth/model";
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
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ message: "Non token found" });
  }
  let payload;
  try {
    payload = jwt.verify(token, `${process.env.SECRET_KEY_TOKEN}`);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    return res.status(400).send({ message: "Error" });
  }
  const user = await userModel.getUser({ id: (payload as JwtPayload).id });
  //const roleName = await roleModel.getRole({user.roleId});
  const roleName = "admin";
  console.log("el pepe");
  if (allowedRoles[roleName as keyof typeof allowedRoles]) {
    next();
  }
};
