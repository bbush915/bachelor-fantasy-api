import { NonEmptyArray } from "type-graphql";

import { ContestantResolver } from "./contestant";
import { UserResolver } from "./user";

const resolvers: NonEmptyArray<Function> = [ContestantResolver, UserResolver];

export default resolvers;
