require('dotenv').config();
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
} from './src/constants';
import { connectRedis } from './src/server/redis';
import server from './src/server/server';
import { ScrappingService, ApiService } from './src/service/service';
import { ScrappingService2 } from './src/service/scrappingServices';
import { getToken } from './src/modules/auth/auth.controller';

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
  const fedexToken = await redis.get('FEDEXTOKEN');
  const redpackToken = await redis.get('REDPACKTOKEN');
  if (!fedexToken || !redpackToken) {
    await FEDEXService.setAuthorization();
    await REDPACKService.setAuthorization();
  }
  const REDPACK_REFRESHER = async () => REDPACKService.setAuthorization();
  const FEDEX_REFRESHER = async () => FEDEXService.setAuthorization();

  setInterval(async () => {
    await REDPACK_REFRESHER();
  }, 600000);
  setInterval(async () => {
    await FEDEX_REFRESHER();
  }, 1800000);
});

server.listen(process.env.PORT, () => {
  console.log(`Listening server on port:${process.env.PORT}`);
});
