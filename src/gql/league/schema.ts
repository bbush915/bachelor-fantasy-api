import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";
import { DbLeague } from "types";

@ObjectType()
export class League implements DbLeague {
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
  description: string;

  @Field()
  logoUrl: string;

  @Field()
  isPublic: boolean;

  @Field()
  isShareable: boolean;

  // NOTE - Field Resolvers

  @Field(() => Season)
  season: Season;

  @Field(() => [LeagueMember])
  leagueMembers: LeagueMember[];

  @Field(() => LeagueMember)
  commissioner: LeagueMember;

  @Field(() => LeagueMember, { nullable: true })
  myLeagueMember: LeagueMember;

  @Field({ nullable: true })
  inviteLink: string;
}

@ArgsType()
export class ValidateLeagueMembershipInput {
  @Field(() => ID)
  leagueId: string;
}

@ArgsType()
export class ValidateLeagueAccessibilityInput {
  @Field(() => ID)
  leagueId: string;

  @Field({ nullable: true })
  authenticationToken?: string;

  @Field({ nullable: true })
  accessToken?: string;
}

@InputType()
export class CreateLeagueInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo: string;

  @Field()
  isPublic: boolean;

  @Field()
  isShareable: boolean;
}

@InputType()
export class UpdateLeagueInput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo: string;

  @Field()
  isPublic: boolean;

  @Field()
  isShareable: boolean;
}

@InputType()
export class DeleteLeagueInput {
  @Field(() => ID)
  id: string;
}
