import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

import { LeagueMember } from "gql/league-member";
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

  @Field(() => LeagueMember)
  leagueMember?: LeagueMember;

  @Field(() => ID)
  seasonWeekId: string;

  @Field(() => [LineupContestant])
  lineupContestants?: LineupContestant[];
}

@ArgsType()
export class MyLineupInput {
  @Field()
  leagueId: string;

  @Field()
  seasonWeekId: string;
}

@ArgsType()
export class LineupInput {
  @Field()
  leagueMemberId: string;

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
