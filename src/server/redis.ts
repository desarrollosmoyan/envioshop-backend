import { createClient } from "redis";

export const connectRedis = async () => {
  const client = createClient();
  client.on("error", (error) => console.log(error));
  await client.connect();
  return client;
};
