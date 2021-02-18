import { NonEmptyArray } from "type-graphql";
import { UserResolver } from "./user";

const resolvers: NonEmptyArray<Function> = [UserResolver];

export default resolvers;
