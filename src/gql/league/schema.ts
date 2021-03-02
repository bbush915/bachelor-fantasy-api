import { Field, ID, ObjectType } from "type-graphql";

import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";

@ObjectType()
export class League {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  seasonId: string;

  @Field(() => ID)
  commissionerUserId: string;

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

  @Field(() => Season)
  season?: Season;
}
