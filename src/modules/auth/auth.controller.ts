import { User } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";
import Users from "./user.model";
import prisma from "../../database/prisma";
import qs from "qs";

export const signupHandler = async (req: Request, res: Response) => {
  try {
    const { password, name, email }: User = req.body;
    const model = new Users(prisma.user);
    const newUser = await model.signup({
      name: name,
      email: email,
      password: password,
    });
    res.status(200).send({
      message: "User created successfully",
      user: {
        ...newUser,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

export const signinHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const model = new Users(prisma.user);
    const isLogged = await model.signin({ email: email, password: password });
    if (isLogged)
      return res
        .status(200)
        .send({ message: "User logged successfully", user: isLogged });
    return res.status(400).send({ message: "User credentials are incorrect" });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
};

export const getToken = async (req: Request, res: Response) => {
  try {
    const data = qs.stringify({
      client_secret: `${process.env.CLIENT_SECRET}`,
      client_id: `${process.env.CLIENT_ID}`,
      grant_type: `${process.env.GRANT_TYPE}`,
    });
    const fedexToken = await axios({
      method: "POST",
      data: data,
      url: "https://apis.fedex.com/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.status(200).json({
      fedex: fedexToken.data,
      dhl: Buffer.from(
        `${process.env.DHL_USERNAME}:${process.env.DHL_PASSWORD}`
      ).toString("base64"),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error);
  }
};
