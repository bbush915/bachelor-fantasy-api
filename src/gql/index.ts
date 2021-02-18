import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";

import resolvers from "./resolvers";

export const getGqlServer = async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers,
  });

  const server = new ApolloServer({
    schema,
  });

  return server;
};
