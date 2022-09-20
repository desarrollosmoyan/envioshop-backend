import { Request, Response } from "express";
import {
  DHLService,
  FEDEXService,
  REDPACKService,
  UPSService,
  ESTAFETAService,
  redisConnection,
} from "../../..";
import { formatRatingResponse } from "../../utils/utils";

export const getRating = async (req: Request, res: Response) => {
  try {
    const DHLRating = await DHLService.getRating(req.body);
    const FEDEXRating = await FEDEXService.getRating(req.body);
    const UPSRating = await UPSService.getRating(req.body);
    const REDPACKRating = await REDPACKService.getRating(req.body);
    const ESTAFETARating = await ESTAFETAService.getRating(req.body);
    const p = await (await redisConnection).get("FEDEXTOKEN");
    const dataToFormat = [DHLRating, UPSRating, FEDEXRating];
    const dataFormated = [
      ...formatRatingResponse(dataToFormat),
      ESTAFETARating,
    ].flatMap((element) => element);
    res.status(200).json({
      message: "Rating maked successfully",
      data: dataFormated,
    });
  } catch (error) {
    res.status(400).send({ message: "Error" });
  }
};
