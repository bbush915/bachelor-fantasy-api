import Koa from "koa";
import cors from "koa-cors";
import "reflect-metadata";

import configuration from "./configuration";
import { getGqlServer } from "./gql";

const main = async () => {
  const app = new Koa();

  app.use(cors({ origin: configuration.client.host }));

  const gqlServer = await getGqlServer();
  app.use(gqlServer.getMiddleware());

  const { port } = configuration.server;

  app.listen(port, () => {
    console.log(`🚀 Server available at http://localhost:${port}`);
  });
};

main();
