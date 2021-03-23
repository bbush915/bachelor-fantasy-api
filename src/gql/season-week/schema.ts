import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class SeasonWeek {
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
