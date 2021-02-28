import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";

import getContext from "./context";
import resolvers from "./resolvers";

export const getGqlServer = async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers,
  });

  const server = new ApolloServer({
    context: getContext,
    schema,
  });

  return server;
};
