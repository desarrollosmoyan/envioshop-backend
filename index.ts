require("dotenv").config();
//import { RedisClientType } from "@redis/client";
//import { createClient } from "redis";
import {
  FEDEX,
  DHL,
  UPS,
  ESTAFETA,
  REDPACK,
  PAQUETEEXPRESS,
  PAQUETEEXPRESSSERVICE,
} from "./src/constants";
import { connectRedis } from "./src/server/redis";
import server from "./src/server/server";
import { ScrappingService, ApiService } from "./src/service/service";
import { ScrappingService2 } from "./src/service/scrappingServices";

export const FEDEXService = new ApiService(FEDEX);
export const DHLService = new ApiService(DHL);
export const UPSService = new ApiService(UPS);
export const REDPACKService = new ApiService(REDPACK);
export const ESTAFETAService = new ScrappingService(ESTAFETA);
export const PAQUETEEXPRESSService = new ApiService(PAQUETEEXPRESSSERVICE);

FEDEXService.setAuthorization();
REDPACKService.setAuthorization();
export const redisConnection = connectRedis();
connectRedis().then(async (redis) => {
  const fedexToken = await redis.get("FEDEXTOKEN");
  const redpackToken = await redis.get("REDPACKTOKEN");
  if (!fedexToken || !redpackToken) {
    await FEDEXService.setAuthorization();
    await REDPACKService.setAuthorization();
  }
  console.log(redpackToken);
  /* const token = await FEDEXService.getAuthorization();
  const rpToken = await REDPACKService.getAuthorization();
  await redis.set("FEDEXTOKEN", JSON.stringify(token));
  await redis.set("REDPACKTOKEN", JSON.stringify(rpToken));
  const p = await redis.get("FEDEXTOKEN");
  const t = await redis.get("REDPACKTOKEN");
  console.log(JSON.parse(t as string));*/
});

server.listen(process.env.PORT, () => {
  console.log(`Listening server on port:${process.env.PORT}`);
});
