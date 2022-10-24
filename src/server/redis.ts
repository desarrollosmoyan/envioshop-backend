import { createClient } from "redis";

export const connectRedis = async () => {
  const client = createClient({
    url: "rediss://default:AVNS_ij75WaV6YFD7gCAV5yc@redisbd-do-user-12128300-0.b.db.ondigitalocean.com:25061",
  });
  client.on("ready", () => console.log("Redis DB connected successfully"));
  client.on("error", (error) => console.log(error));
  await client.connect();
  return client;
};
