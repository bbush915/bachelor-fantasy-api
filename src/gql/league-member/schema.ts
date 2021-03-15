import { ArgsType, Field, ID, Int, ObjectType } from "type-graphql";

import { User } from "gql/user";

@ObjectType()
export class LeagueMember {
  @Field(() => ID)
  id?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  leagueId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  isCommissioner?: boolean;

  @Field(() => User)
  user?: User;

  @Field(() => Int, { nullable: true })
  weeklyScore?: number;

  @Field(() => Int, { nullable: true })
  cumulativeScore?: number;

  @Field(() => Int, { nullable: true })
  place?: number;

  @Field()
  isLineupSet?: boolean;
}

@ArgsType()
export class OverallScoreDetailsInput {
  @Field()
  leagueId: string;

  @Field(() => Int)
  weekNumber: number;
}

@ArgsType()
export class WeeklyScoreDetailsInput {
  @Field()
  leagueId: string;

  @Field()
  seasonWeekId: string;
}
