import { Request, Response } from "express";
import {
  DHLService,
  FEDEXService,
  REDPACKService,
  UPSService,
  ESTAFETAService,
  //redisConnection,
  PAQUETEEXPRESSService,
} from "../../..";
import { formatRatingResponse } from "../../utils/utils";

export const getRating = async (req: Request, res: Response) => {
  try {
    const DHLRating = DHLService.getRating(req.body);
    const FEDEXRating = FEDEXService.getRating(req.body);
    const UPSRating = UPSService.getRating(req.body);
    const REDPACKRating = REDPACKService.getRating(req.body);
    const ESTAFETARating = ESTAFETAService.getRating(req.body);
    const PAQUETEEXPRESSRating = PAQUETEEXPRESSService.getRating(req.body);
    const arrOfPromises = await Promise.all([
      DHLRating,
      UPSRating,
      FEDEXRating,
      PAQUETEEXPRESSRating,
      REDPACKRating,
      ESTAFETARating,
    ]);
    //const p = await (await redisConnection).get("FEDEXTOKEN");
    const dataToFormat = [...arrOfPromises].flat(1);
    const dataFormated = [...formatRatingResponse(dataToFormat)]
      .flatMap((element) => element)
      .filter((item) => item);
    res.status(200).json({
      message: "Rating maked successfully",
      data: dataFormated,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error" });
  }
};
