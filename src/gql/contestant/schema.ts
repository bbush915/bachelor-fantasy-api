import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Contestant {
  @Field(() => ID)
  id: string;

  @Field()
  seasonId: string;

  @Field()
  name: string;

  @Field()
  imageUrl: string;

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
