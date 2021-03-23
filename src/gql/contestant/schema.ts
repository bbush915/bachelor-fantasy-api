import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Contestant {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  seasonId: string;

  @Field()
  name: string;

  @Field()
  headshotUrl: string;

  @Field(() => Int)
  age: number;

  @Field()
  occupation: string;

  @Field()
  hometown: string;

  @Field()
  bio: string;

  @Field(() => [String])
  trivia: string[];

  @Field(() => Boolean)
  isFavorite: boolean;
}
