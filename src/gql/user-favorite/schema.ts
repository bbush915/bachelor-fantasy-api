import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class UserFavorite {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  contestantId: string;
}
