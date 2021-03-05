import { Field, ID, ObjectType } from "type-graphql";

import { SeasonWeek } from "gql/season-week";

@ObjectType()
export class Season {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field({ nullable: true })
  currentWeekNumber?: number;

  @Field(() => SeasonWeek, { nullable: true })
  currentSeasonWeek?: SeasonWeek;

  @Field()
  series: string;

  @Field()
  seasonNumber: number;
}
