"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRating = void 0;
const __1 = require("../../..");
const getRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("el pepe");
        yield __1.fedexService.setAuthorizationToken();
        const fedexRating = yield __1.fedexService.getRating(req.body);
        const dhlRating = yield __1.dhlService.getRating(req.body);
        const upsRating = yield __1.upsService.getRating(req.body);
        console.log(fedexRating);
        res
            .status(200)
            .send({ fedex: fedexRating, dhl: dhlRating, ups: upsRating });
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
    }
});
exports.getRating = getRating;
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
