import { Request, Response } from "express";
import { DHL } from "../../constants";
import { makeTrackRequest } from "../../utils/utils";

export const trackASingleShipment = async (req: Request, res: Response) => {
  try {
    /* await makeTrackRequest({
      url: DHL.tracking.url,
      headers: {
        ...DHL.tracking.headers,
        Authorization: DHL.Authorization,
      },
    });*/
  } catch (error) {}
};
