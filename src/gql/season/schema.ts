import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

import { SeasonWeek } from "gql/season-week";
import { DbSeason } from "types";

@ObjectType()
export class Season implements DbSeason {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int)
  currentWeekNumber: number;

  @Field()
  seriesName: string;

  @Field(() => Int)
  seasonNumber: number;

  @Field()
  isActive: boolean;

  @Field()
  isComplete: boolean;

  // NOTE - Field Resolvers.

  @Field(() => SeasonWeek)
  currentSeasonWeek: SeasonWeek;

  @Field(() => SeasonWeek, { nullable: true })
  previousSeasonWeek?: SeasonWeek;
}

@InputType()
export class AdvanceCurrentWeekInput {
  @Field()
  shouldComplete: boolean;

  @Field({ nullable: true })
  nextEpisodeAirDate?: Date;

  @Field(() => Int, { nullable: true })
  nextLineupSpotsAvailable?: number;
}
