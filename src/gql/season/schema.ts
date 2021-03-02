import { Field, ID, ObjectType } from "type-graphql";

import { SeasonWeek } from "gql/season-week";

@ObjectType()
export class Season {
  @Field(() => ID)
  id: string;

  @Field()
  series: string;

  @Field()
  seasonNumber: string;

  @Field()
  currentWeekNumber: number;

  @Field(() => SeasonWeek)
  currentWeek?: SeasonWeek;
}
