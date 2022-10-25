import { createClient } from "redis";

export const connectRedis = async () => {
  const client = createClient({
    url: `${process.env.REDIS_URL}`,
  });
  client.on("ready", () => console.log("Redis DB connected successfully"));
  client.on("error", (error) => console.log(error));
  await client.connect();
  return client;
};
