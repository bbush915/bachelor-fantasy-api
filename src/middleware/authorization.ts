import { MiddlewareFn } from "type-graphql";

import { IContext } from "gql/context";

const authorization =
  (roles: string[]): MiddlewareFn<IContext> =>
  async ({ context: { identity } }, next) => {
    if (!identity || (identity.role !== "admin" && !roles.includes(identity.role))) {
      throw new Error("Unauthorized");
    }

    return next();
  };

export default authorization;
