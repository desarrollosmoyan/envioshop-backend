require("dotenv").config();
import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { FEDEX, DHL, UPS, ESTAFETA, REDPACK } from "./src/constants";
import { connectRedis } from "./src/server/redis";
import server from "./src/server/server";
import { ScrappingService, ApiService } from "./src/service/service";

export const FEDEXService = new ApiService(FEDEX);
export const DHLService = new ApiService(DHL);
export const UPSService = new ApiService(UPS);
export const REDPACKService = new ApiService(REDPACK);
export const ESTAFETAService = new ScrappingService(ESTAFETA);

export const redisConnection = connectRedis();
connectRedis().then(async (redis) => {
  await FEDEXService.setAuthorization();
  const token = await FEDEXService.getAuthorization();
  await redis.set("FEDEXTOKEN", token);
});

server.listen(process.env.PORT, () => {
  console.log(`Listening server on port:${process.env.PORT}`);
});
