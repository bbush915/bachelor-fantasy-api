import { NonEmptyArray } from "type-graphql";

import { ContestantResolver } from "./contestant";
import { LeagueResolver } from "./league";
import { LeagueMemberResolver } from "./league-member";
import { LineupResolver } from "./lineup";
import { LineupContestantResolver } from "./lineup-contestant";
import { SeasonResolver } from "./season";
import { SeasonWeekResolver } from "./season-week";
import { UserResolver } from "./user";

const resolvers: NonEmptyArray<Function> = [
  ContestantResolver,
  LeagueMemberResolver,
  LeagueResolver,
  LineupContestantResolver,
  LineupResolver,
  SeasonResolver,
  SeasonWeekResolver,
  UserResolver,
];

export default resolvers;
