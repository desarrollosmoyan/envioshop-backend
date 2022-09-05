import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import prisma from "../database/prisma";

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
  console.log(payload);
  const user = await prisma.user.findFirst({
    where: {
      id: (payload as JwtPayload).id,
    },
    include: {
      Role: true,
    },
  });

  const roleName = user?.Role.name;
  if (allowedRoles[roleName as keyof typeof allowedRoles]) {
    console.log("el pepe");
    next();
  }
};
