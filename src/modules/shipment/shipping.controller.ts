import { Request, Response } from "express";
import { DHLService, FEDEXService, REDPACKService, UPSService } from "../../..";
import { ApiService } from "../../service/service";

type Services = {
  FEDEX: ApiService;
  DHL: ApiService;
  REDPACK: ApiService;
  UPS: ApiService;
};
export const createShipment = async (req: Request, res: Response) => {
  try {
    const { company } = req.params;
    if (!company) return res.status(401).json({ message: "Bad request" });
    const services: Services = {
      FEDEX: FEDEXService,
      DHL: DHLService,
      REDPACK: REDPACKService,
      UPS: UPSService,
    };
    const shippingService = services[company as keyof Services];
    console.log(shippingService);
    const data = await shippingService.createShipping(req.body);
    if (data) return res.status(200).json({ shipment: data });
  } catch (error: any) {
    console.log(error);
    res.status(404).send(error);
  }
};
