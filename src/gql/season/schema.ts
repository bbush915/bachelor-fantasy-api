import { Field, ID, Int, ObjectType } from "type-graphql";

import { SeasonWeek } from "gql/season-week";

@ObjectType()
export class Season {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int, { nullable: true })
  currentWeekNumber?: number;

  @Field()
  seriesName: string;

  @Field(() => Int)
  seasonNumber: number;

  @Field()
  isActive: boolean;

  @Field(() => SeasonWeek, { nullable: true })
  currentSeasonWeek?: SeasonWeek;

  @Field(() => SeasonWeek, { nullable: true })
  previousSeasonWeek?: SeasonWeek;
}
