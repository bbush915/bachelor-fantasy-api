import Koa from "koa";
import cors from "koa-cors";
import "reflect-metadata";

import configuration from "./configuration";
import { getGqlServer } from "./gql";

const main = async () => {
  const app = new Koa();

  const gqlServer = await getGqlServer();
  await gqlServer.start();

  const corsMiddleware = cors({ origin: configuration.client.host });
  app.use(corsMiddleware);

  const gqlMiddleware = gqlServer.getMiddleware();
  app.use(gqlMiddleware);

  const { port } = configuration.server;

  app.listen(port, () => {
    console.log(`🚀 Server available at http://localhost:${port}`);
  });
};

main();
