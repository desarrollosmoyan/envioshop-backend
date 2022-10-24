import { Request, Response } from "express";
import { DHL } from "../../constants";
import { makeTrackRequest } from "../../utils/utils";
import { DHLService, FEDEXService, REDPACKService, UPSService } from "../../..";
export const trackASingleShipment = async (req: Request, res: Response) => {
  try {
    const { trackingNumber } = req.body;
    const dhlResponse = DHLService.getTracking(trackingNumber);
    //const upsResponse = UPSService.getTracking(trackingNumber);
    //const fedexResponse = FEDEXService.getTracking(trackingNumber);
    const arrOfPromises = await Promise.all([
      dhlResponse,
      //upsResponse,
      //fedexResponse,
    ]);
    /*console.log(dhlResponse.data);
    console.log(upsResponse.data.trackResponse.shipment[0].package);
    console.log(fedexResponse.data.output.completeTrackResults[0].trackResults);*/
  } catch (error: any) {
    console.log(error);
    console.log({ msg: error.response });
  }
};
