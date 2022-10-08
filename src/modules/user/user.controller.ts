import { Franchise } from "@prisma/client";
import { Request, Response } from "express";
import adminModel from "../../database/models/admin.model";
import cashierModel from "../../database/models/cashier.model";
import franchiseModel from "../../database/models/franchise.model";

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
    const franchiseList = await franchiseModel.getAll();
    if (!franchiseList) return res.status(400).json({ message: "Error" });
    const franchiseListCleaned = franchiseList.map(
      (franchiseItem: Franchise) => {
        const { password, id, ...franchise } = franchiseItem;
        return franchise;
      }
    );
    res.status(200).json([...franchiseListCleaned]);
  } catch (error) {
    res.status(400).send({ message: "Error" });
  }
};

export const getAllCashiers = async (req: Request, res: Response) => {
  try {
    const cashierList = await cashierModel.getAll();
    if (!cashierList) return res.status(400).json({ message: "error" });
    res.status(200).json([...cashierList]);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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

export const createAFranchise = async (req: Request, res: Response) => {
  try {
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
