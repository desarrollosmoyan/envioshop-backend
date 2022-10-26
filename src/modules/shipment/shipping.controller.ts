import axios from "axios";
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
    const { company } = req.params;
    const { franchiseId, turnId, shipmentPrice } = req.body;
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
    console.log(req.body);
    if (info.document.type === "ZPL") {
      console.log("entro");
      const { data } = await axios({
        method: "POST",
        responseEncoding: "binary",
        responseType: "arraybuffer",
        url: "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
        data: info.document.content,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/pdf",
        },
      });
      const base64 = Buffer.from(data).toString("base64");
      info.document.content = base64;
      info.document.type = "PDF";
    }
    const newSale = await salesModel.create({
      serviceName: serviceNameMap[company as keyof typeof serviceNameMap],
      serviceType: info.service.name,
      shipmentDescription: "",
      shipmentPrice: parseFloat(shipmentPrice),
      shipmentPdf: info.document.content,
      shipper: {
        postalCode: info.package.originZipCode,
      },
      receiver: {
        postalCode: info.package.destinyZipCode,
      },
      franchiseId: franchiseId,
      turnId: turnId,
    });
    if (data) return res.status(200).json({ shipment: info });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllShipments = async (req: Request, res: Response) => {};
