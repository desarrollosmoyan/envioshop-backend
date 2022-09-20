import { Request, Response } from "express";
import userModel from "../auth/model";
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, offset } = req.query;
    const userList = await userModel.getUsers(
      parseInt(page as string),
      parseInt(offset as string)
    );
    res.status(200).json({ users: userList });
  } catch (error: any) {
    res.status(400).json({ message: error.message, error: error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userInfo = req.body;
    const newUser = await userModel.signup(userInfo);
    res.status(200).json({
      message: "User created successfuly",
      user: {
        ...newUser,
        token: null,
        password: null,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "Can't create user",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userNewData = { data: { ...req.body }, id: req.params.id };
    const userUpdated = await userModel.updateUser(userNewData);
    if (!userUpdated) return res.status(401).json({ message: "Bad Request" });
    res.status(200).json({
      message: "User updated successfully",
      user: {
        ...userUpdated,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error, message: error.message });
  }
};
