import { Router } from "express";
import { trackASingleShipment } from "./tracking.controller";

const trackingRouter = Router();

trackingRouter.post("/", trackASingleShipment);

export default trackingRouter;
