import axios from "axios";
import { Request, Response } from "express";
import { fedexService, dhlService, upsService } from "../../..";
import { formatRatingBody } from "../../utils/utils";

export const getRating = async (req: Request, res: Response) => {
  try {
    console.log("el pepe");
    await fedexService.setAuthorizationToken();
    const fedexRating = await fedexService.getRating(req.body);
    const dhlRating = await dhlService.getRating(req.body);
    const upsRating = await upsService.getRating(req.body);
    console.log(fedexRating);
    res
      .status(200)
      .send({ fedex: fedexRating, dhl: dhlRating, ups: upsRating });
  } catch (error) {
    res.status(400).send({ message: "Error" });
  }
};
/*try {
  const ratingData: Rating = req.body;
  if (!req.headers.authorization) {
    return res.status(403).send({ message: "No auth token" });
  }
  //const { fedexSchema, dhlSchema, upsSchema } = formatRatingBody(ratingData);
  const fedexResponse = await axios.post(FEDEX.rating.url, fedexSchema, {
    headers: {
      ...FEDEX.rating.headers,
      Authorization: req.headers.authorization,
    },
  });
  const dhlResponse = await axios.post(DHL.rating.url, dhlSchema, {
    headers: {
      ...DHL.rating.headers,
    },
  });

  const upsResponse = await axios.post(UPS.rating.url, upsSchema, {
    headers: {
      ...UPS.rating.headers,
    },
  });
  res.status(200).send({
    fedex: fedexResponse.data,
    dhl: dhlResponse.data,
    ups: upsResponse.data,
  });
} catch (error: any) {
  console.log(error.response);
  res.status(400).send(error.data);
}*/
