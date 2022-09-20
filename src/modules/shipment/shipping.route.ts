import { Router } from "express";
import { createShipment } from "./shipping.controller";

const shippingRouter = Router();

shippingRouter.post("/:company", createShipment);

export default shippingRouter;
