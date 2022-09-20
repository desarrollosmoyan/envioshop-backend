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
    console.log("Xd");
    const { company } = req.params;
    console.log(company);
    if (!company) return res.status(401).json({ message: "Bad request" });
    const services: Services = {
      FEDEX: FEDEXService,
      DHL: DHLService,
      REDPACK: REDPACKService,
      UPS: UPSService,
    };
    const shippingService = services[company as keyof Services];
    console.log(req.body);
    const data = await shippingService.createShipping(req.body);
    console.log(data);
    if (data) return res.status(200).json({ shipment: data });
  } catch (error: any) {
    console.log(error);
  }
};
