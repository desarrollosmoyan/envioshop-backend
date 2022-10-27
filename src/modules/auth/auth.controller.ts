import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import { createUserByType, loginUserByType } from "../../utils/utils";
import { CashierData } from "../../database/models/cashier.model";
import { AdminData } from "../../database/models/admin.model";
import { FranchiseData } from "../../database/models/franchise.model";
export const signupHandler = async (req: Request, res: Response) => {
  try {
    const {
      data,
      type,
    }: { data: CashierData | AdminData | FranchiseData; type: string } =
      req.body;
    const newUser = await createUserByType(data, type);
    if (!newUser) return res.status(401).json({ message: "" });
    console.log(newUser);
    res.status(200).send({
      message: "User created successfully",
      ...newUser,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

export const signinHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, type } = req.body;
    const isLogged = await loginUserByType({
      email: email,
      password: password,
    });
    if (!isLogged)
      return res
        .status(400)
        .send({ message: "User credentials are incorrect" });
    res.status(200).json({ message: "User logged successfully", ...isLogged });
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
