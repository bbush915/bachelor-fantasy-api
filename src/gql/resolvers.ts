import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./user";
import { ContestantResolver } from "./contestants";

const resolvers: NonEmptyArray<Function> = [ContestantResolver, UserResolver];

export default resolvers;
