import { Field, ID, ObjectType } from "type-graphql";

import { User } from "gql/user";

@ObjectType()
export class LeagueMember {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  leagueId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => User)
  user?: User;

  @Field()
  totalScore: number;

  @Field({ nullable: true })
  weeklyScore?: number;
}
