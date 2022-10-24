import { Request, Response } from "express";
import { DHLService, FEDEXService, REDPACKService, UPSService } from "../../..";
import salesModel, { serviceName } from "../../database/models/sales.model";
import { ApiService } from "../../service/service";
import { formatShippingBody, formatShippingResponse } from "../../utils/utils";

type Services = {
  FEDEX: ApiService;
  DHL: ApiService;
  REDPACK: ApiService;
  UPS: ApiService;
};
export const createShipment = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { company } = req.params;
    if (!company) return res.status(400).json({ message: "Bad request" });
    const services: Services = {
      FEDEX: FEDEXService,
      DHL: DHLService,
      REDPACK: REDPACKService,
      UPS: UPSService,
    };
    const serviceNameMap: any = {
      FEDEX: serviceName.FEDEX,
      DHL: serviceName.DHL,
      REDPACK: serviceName.REDPACK,
      UPS: serviceName.UPS,
    };
    const shippingService = services[company as keyof Services];
    const data = await shippingService.createShipping(req.body);
    const info = await formatShippingResponse(data, company);
    if (data) return res.status(200).json({ shipment: info });
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getAllShipments = async (req: Request, res: Response) => {};
