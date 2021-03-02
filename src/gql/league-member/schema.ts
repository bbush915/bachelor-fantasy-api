import { Field, ID, ObjectType } from "type-graphql";

import { User } from "gql/user";

@ObjectType()
export class LeagueMember {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  leagueId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  totalScore: number;

  @Field(() => User)
  user?: User;
}
