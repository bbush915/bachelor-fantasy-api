import { Field, ID, ObjectType } from "type-graphql";

import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";
import { User } from "gql/user";

@ObjectType()
export class League {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  seasonId: string;

  @Field(() => Season)
  season?: Season;

  @Field(() => ID)
  commissionerId: string;

  @Field(() => User)
  commissioner?: User;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  imageUrl: string;

  @Field()
  isPublic: boolean;

  @Field()
  isShareable: boolean;

  @Field(() => [LeagueMember])
  leagueMembers?: LeagueMember[];
}
