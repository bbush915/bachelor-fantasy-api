import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Contestant {
  @Field(() => ID)
  id: string;

  @Field()
  season_id: string;

  @Field()
  name: string;

  @Field()
  image_lg_url: string;

  @Field()
  image_sm_url: string;

  @Field()
  age: number;

  @Field()
  occupation: string;

  @Field()
  hometown: string;

  @Field()
  bio: string;

  @Field(() => [String])
  trivia: string[];
}
