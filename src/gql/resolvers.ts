import { NonEmptyArray } from "type-graphql";

import { ContestantResolver } from "./contestant";
import { LineupResolver } from "./lineup";
import { LineupContestantResolver } from "./lineup-contestants";
import { UserResolver } from "./user";

const resolvers: NonEmptyArray<Function> = [ContestantResolver, LineupContestantResolver, LineupResolver, UserResolver];

export default resolvers;
