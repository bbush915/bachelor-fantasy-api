import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class LeagueMemberScore {
  @Field(() => ID)
  leagueMemberId: string;

  @Field(() => ID)
  seasonWeekId: string;

  @Field(() => Int, { nullable: true })
  weeklyScore?: number;

  @Field(() => Int, { nullable: true })
  weeklyRank?: number;

  @Field(() => Int, { nullable: true })
  cumulativeScore?: number;

  @Field(() => Int, { nullable: true })
  cumulativeRank?: number;
}
