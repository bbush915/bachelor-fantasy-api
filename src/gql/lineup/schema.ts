import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

import { LineupContestant } from "gql/lineup-contestant";

@ObjectType()
export class Lineup {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  leagueMemberId: string;

  @Field(() => ID)
  seasonWeekId: string;

  @Field({ nullable: true })
  weeklyScore?: number;

  @Field(() => [LineupContestant])
  lineupContestants?: LineupContestant[];
}

@ArgsType()
export class LineupInput {
  @Field()
  leagueId: string;

  @Field()
  seasonWeekId: string;
}

@InputType()
export class SaveLineupInput {
  @Field()
  leagueId: string;

  @Field()
  seasonWeekId: string;

  @Field(() => [String])
  contestantIds: string[];
}
