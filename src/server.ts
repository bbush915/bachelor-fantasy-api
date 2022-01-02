import Koa from "koa";
import cors from "koa-cors";
import "reflect-metadata";

import configuration from "./configuration";
import { getGqlServer } from "./gql";

const main = async () => {
  // NOTE - Set up GraphQL server.

  const gqlServer = await getGqlServer();
  await gqlServer.start();

  // NOTE - Set up Koa application.

  const app = new Koa();

  const corsMiddleware = cors({ origin: configuration.client.host });
  app.use(corsMiddleware);

  const gqlMiddleware = gqlServer.getMiddleware();
  app.use(gqlMiddleware);

  const { port } = configuration.server;

  app.listen(port, () => {
    console.log(`🚀 Server available at http://localhost:${port}`);
  });
};

main().catch((error) => console.error("Unhandled error: ", error));
