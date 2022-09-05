require("dotenv").config();
import { RedisClientType } from "@redis/client";
import { FEDEX, DHL, UPS } from "./src/constants";
import server from "./src/server/server";
import Service from "./src/service/service";

export const fedexService = new Service(
  FEDEX.baseUrl,
  { ...FEDEX.headers },
  FEDEX.subServices,
  "Fedex"
);

export const dhlService = new Service(
  DHL.baseUrl,
  { ...DHL.headers },
  DHL.subServices,
  "DHL"
);
export const upsService = new Service(
  UPS.baseUrl,
  { ...UPS.headers },
  UPS.subServices,
  "UPS"
);

server.listen(process.env.PORT, () => {
  console.log(`Listening server on port:${process.env.PORT}`);
});
