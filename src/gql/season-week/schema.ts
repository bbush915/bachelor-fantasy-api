import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class SeasonWeek {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  seasonId: string;

  @Field()
  weekNumber: number;

  @Field()
  episodeAirDate: Date;

  @Field()
  lineupSpotsAvailable: number;
}
