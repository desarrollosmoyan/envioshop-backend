import { Franchise, prisma } from "@prisma/client";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { decode, JwtPayload } from "jsonwebtoken";
import adminModel from "../../database/models/admin.model";
import cashierModel from "../../database/models/cashier.model";
import franchiseModel from "../../database/models/franchise.model";

export const getUser = async (req: Request, res: Response) => {
  const payload = decode(req.token as string) as JwtPayload;
  const map = {
    admin: () => adminModel.get({ id: payload.id }),
    franchise: () => franchiseModel.get({ id: payload.id }),
    cashier: () => cashierModel.get({ id: payload.id }),
  };
  const { type } = payload;
  const user = await map[type as keyof typeof map]();
  try {
    if (!user) throw new Error("Can't get user");
    res.status(200).json({
      message: "User getted successfully",
      user: {
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const createOneAdmin = async (req: Request, res: Response) => {
  try {
    const newAdmin = await adminModel.create(req.body);
    if (!newAdmin) return res.status(401).json("Error");
    res
      .status(200)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error: any) {
    res.status(400).json({ error: error, message: error.message });
  }
};
export const getAllFranchises = async (req: Request, res: Response) => {
  try {
    console.log("sexo");
    const { offset, limit } = req.query;
    const body = req.body;

    const franchiseList = await franchiseModel.getAll(
      [parseInt(offset as string), parseInt(limit as string)],
      body.cityName
    );
    const totalFranchises = await franchiseModel.count();
    if (!franchiseList) return res.status(400).json({ message: "Error" });
    res
      .status(200)
      .json({ total: totalFranchises, franchises: [...franchiseList] });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};

export const getAllFranchisesByCity = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const cityName = req.body.cityName;
    const list = await franchiseModel.getAll(
      [parseInt(offset as string), parseInt(limit as string)],
      cityName
    );
    const totalFranchises = await franchiseModel.count();
    if (!list) throw new Error("Something wrong");
    res.status(200).json({
      message: "successfully",
      franchises: list,
      total: totalFranchises,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error" });
  }
};
export const getAllFranchisesCities = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const franchisesCitiesList = await franchiseModel.getAllFranchiseCities([
      parseInt(offset as string),
      parseInt(limit as string),
    ]);
    if (!franchisesCitiesList) throw new Error("Something is wrong");
    res
      .status(200)
      .json({ message: "Sucessfully request", cities: franchisesCitiesList });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOneFranchise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //const payload = decode(req.token as string) as JwtPayload;
    console.log("entro get one franchise");
    console.log(req.body);
    console.log(req.params);
    console.log(req.url);
    const franchiseId = req.params.id;
    const franchise = await franchiseModel.get({ id: franchiseId });
    if (!franchise)
      return res.status(400).json({ message: "Can't get current franchise" });
    res.status(200).json({ ...franchise });
  } catch (error) {
    console.log(error);
  }
};
export const getAllCashiers = async (req: Request, res: Response) => {
  try {
    const { offset = 0, limit = 0 } = req.query;
    const cashierList = await cashierModel.getAll(
      [parseInt(offset as string), parseInt(limit as string)],
      undefined
    );
    const cashierCount = await cashierModel.count();
    if (!cashierList) return res.status(400).json({ message: "error" });
    res.status(200).json({ total: cashierCount, cashiers: [...cashierList] });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOneFranchise = async (req: Request, res: Response) => {
  try {
    const franchiseId = req.params.id;
    const updatedFranchsie = await franchiseModel.update({
      id: franchiseId,
      data: req.body,
    });
    if (!updatedFranchsie)
      return res.status(400).json({ message: "Can't update franchise" });
    res.status(200).json({ message: "Franchise updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Something wrong" });
  }
};
export const deleteOneFranchise = async (req: Request, res: Response) => {
  try {
    const franchiseId = req.params.id;
    const deletedFranchise = await franchiseModel.delete(franchiseId);
    if (!deletedFranchise)
      return res.status(400).json({ message: "Can't delete franchise" });
    res.status(200).json({ message: "Franchise deleted successfully" });
  } catch (error) {}
};

export const deleteManyFranchises = async (req: Request, res: Response) => {
  try {
    const franchisesIds = req.body.ids;
    const deletedFranchises = await franchiseModel.deleteMany(franchisesIds);
    if (!deletedFranchises) throw new Error("Something is wrong");
    res.status(200).json({ message: "Sucessfully operation" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteManyCashiers = async (req: Request, res: Response) => {
  try {
    const cashiersIds = req.body.ids;
    const deletedCashiers = await cashierModel.deleteMany(cashiersIds);
    console.log(deletedCashiers);
    if (!deletedCashiers) throw new Error("Something is wrong");
    res.status(200).json({ message: "Sucessfully operation" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createAFranchise = async (req: Request, res: Response) => {
  try {
    const payload = decode(req.token as string) as JwtPayload;
    const franchiseData = req.body;
    const newFranchise = await franchiseModel.create(franchiseData, false);
    if (!newFranchise)
      return res.status(401).json({ message: "Can't create franchise" });
    res.status(200).json({ franchise: newFranchise });
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

export const createACashier = async (req: Request, res: Response) => {
  try {
    const cashierData = req.body;
    const newCashier = await cashierModel.create(cashierData, false);
    if (!newCashier)
      return res.status(401).json({ message: "Can't create cashier" });
    res.status(200).json({
      message: "User created successfully",
      ...newCashier,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const updateOneCashier = async (req: Request, res: Response) => {
  try {
    const cashierId = req.params.id;
    const updatedCashier = await cashierModel.update({
      id: cashierId,
      data: req.body,
    });
    if (!updatedCashier)
      return res.status(400).json({ message: "Can't update cashier" });
    res.status(200).json({
      message: "Cashier updated successfully",
      cashier: updatedCashier,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getOneCashier = async (req: Request, res: Response) => {
  try {
    const cashierId = req.params.id;
    const cashier = await cashierModel.get({ id: cashierId });
    if (!cashier)
      return res.status(400).json({ message: "Can't get current cashier" });
    return res.status(200).json({ ...cashier });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getFranchiseBySearch = async (req: Request, res: Response) => {
  try {
    const value = req.params.value;
    if (!value) throw new Error("Value is null");
    console.log(req.params.offset, req.params.limit);
    const offset = parseInt(req.query.offset as string);
    const limit = parseInt(req.query.limit as string);
    const franchisesMatched = await franchiseModel.getBySearch(value, [
      offset,
      limit,
    ]);
    if (!franchiseModel) throw new Error("Something is wrong");
    res.status(200).json({
      message: "Successfully Operation",
      franchises: franchisesMatched,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteOneCashier = async (req: Request, res: Response) => {
  try {
    const cashierId = req.params.id;
    const deletedCashier = await cashierModel.delete(cashierId);
    if (!deletedCashier)
      return res.status(400).json({ message: "Can't delete cashier" });
    res.status(200).json({ message: "Franchise deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCashiersFromOneFranchise = async (
  req: Request,
  res: Response
) => {
  try {
    const { offset, limit } = req.params;
    const payload = decode(req.token as string) as JwtPayload;
    const cashiersList = await cashierModel.getAll(
      [parseInt(offset), parseInt(limit)],
      payload.id
    );
    if (!cashiersList) throw new Error("Something wrong");
    return res
      .status(200)
      .json({ message: "List of cashiers", cashiers: [...cashiersList] });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

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
export const getMe = async (req: Request, res: Response) => {
  try {
    const payload = decode(req.token as string) as JwtPayload;
    const me = await userMap[payload.type as keyof typeof userMap](payload.id);
    if (!me) throw new Error("User doesn't exist");
    res.status(200).json({ message: "User getted sucessfully", user: me });
  } catch (err: any) {
    res.status(400).json({ message: "error" });
  }
};
