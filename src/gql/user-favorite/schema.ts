import { Field, ID, InputType, ObjectType } from "type-graphql";

import { DbUserFavorite } from "types";

@ObjectType()
export class UserFavorite implements DbUserFavorite {
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

@InputType()
export class ToggleUserFavoriteInput {
  @Field(() => ID)
  contestantId: string;
}
