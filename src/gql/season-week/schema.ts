import { Field, ID, Int, ObjectType } from "type-graphql";

import { DbSeasonWeek } from "types";

@ObjectType()
export class SeasonWeek implements DbSeasonWeek {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  seasonId: string;

  @Field(() => Int)
  weekNumber: number;

  @Field()
  episodeAirDate: Date;

  @Field(() => Int)
  lineupSpotsAvailable: number;
}
