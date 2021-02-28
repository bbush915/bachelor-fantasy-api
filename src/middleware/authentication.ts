import { IContext } from "gql/context";
import { decode } from "lib/jwt";

import { MiddlewareFn } from "type-graphql";

const authentication: MiddlewareFn<IContext> = async ({ context }, next) => {
  const token = context.authorization?.split(" ")[1];

  if (!token) {
    throw new Error("Missing header: Authorization");
  }

  context.identity = decode(token) as any;

  return next();
};

export default authentication;
