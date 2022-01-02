import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

import { Contestant } from "gql/contestant";
import { DbSeasonWeekContestant } from "types";

@ObjectType()
export class SeasonWeekContestant implements DbSeasonWeekContestant {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  seasonWeekId: string;

  @Field(() => ID)
  contestantId: string;

  @Field({ nullable: true })
  rose?: boolean;

  @Field({ nullable: true })
  specialRose?: boolean;

  @Field({ nullable: true })
  groupDate?: boolean;

  @Field({ nullable: true })
  oneOnOneDate?: boolean;

  @Field({ nullable: true })
  twoOnOneDate?: boolean;

  @Field({ nullable: true })
  sentHome?: boolean;

  @Field(() => Int, { nullable: true })
  score?: number;

  // NOTE - Field Resolvers.

  @Field(() => Contestant)
  contestant?: Contestant;
}

@InputType()
export class ScoreSeasonWeekContestantsInput {
  @Field(() => [SeasonWeekContestantScoreInput])
  scores: SeasonWeekContestantScoreInput[];
}

@InputType()
export class SeasonWeekContestantScoreInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  seasonWeekId: string;

  @Field()
  rose: boolean;

  @Field()
  specialRose: boolean;

  @Field()
  groupDate: boolean;

  @Field()
  oneOnOneDate: boolean;

  @Field()
  twoOnOneDate: boolean;

  @Field()
  sentHome: boolean;
}
