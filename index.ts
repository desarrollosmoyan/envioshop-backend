require("dotenv").config();
import server from "./server/server";

server.listen(process.env.PORT, () => {
  console.log(`Listening server on port:${process.env.PORT}`);
});
