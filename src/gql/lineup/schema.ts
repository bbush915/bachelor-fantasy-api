import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

import { LineupContestant } from "gql/lineup-contestant";
import { DbLineup } from "types";

@ObjectType()
export class Lineup implements DbLineup {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  leagueMemberId: string;

  @Field(() => ID)
  seasonWeekId: string;

  // NOTE - Field Resolvers

  @Field(() => [LineupContestant])
  lineupContestants: LineupContestant[];
}

@ArgsType()
export class MyLineupInput {
  @Field(() => ID)
  leagueId: string;

  @Field(() => ID)
  seasonWeekId: string;
}

@ArgsType()
export class LineupInput {
  @Field(() => ID)
  leagueMemberId: string;

  @Field(() => ID)
  seasonWeekId: string;
}

@InputType()
export class SaveLineupInput {
  @Field(() => ID)
  leagueId: string;

  @Field(() => ID)
  seasonWeekId: string;

  @Field(() => [ID])
  contestantIds: string[];
}
