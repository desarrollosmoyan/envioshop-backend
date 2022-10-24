import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const onlyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "") as string;
  const payload = verify(
    token as string,
    `${process.env.SECRET_KEY_TOKEN}`
  ) as JwtPayload;
  if (payload.type === "admin") {
    req.token = token;
    next();
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
};

export default onlyAdmin;
