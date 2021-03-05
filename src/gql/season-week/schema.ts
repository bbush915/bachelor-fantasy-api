import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class SeasonWeek {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  seasonId: string;

  @Field()
  weekNumber: number;

  @Field()
  episodeAirDate: Date;

  @Field()
  lineupSpotsAvailable: number;
}
