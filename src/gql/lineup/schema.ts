import { Field, ID, ObjectType } from "type-graphql";

import { LineupContestant } from "gql/lineup-contestant";

@ObjectType()
export class Lineup {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  leagueMemberId: string;

  @Field(() => ID)
  weekId: string;

  @Field({ nullable: true })
  weeklyScore?: number;

  @Field(() => [LineupContestant])
  lineupContestants?: LineupContestant[];
}
