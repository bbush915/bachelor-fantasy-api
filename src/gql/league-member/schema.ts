import { Field, ID, InputType, ObjectType } from "type-graphql";

import { LeagueMemberScore } from "gql/league-member-score";
import { Lineup } from "gql/lineup";
import { User } from "gql/user";
import { DbLeagueMember } from "types";

@ObjectType()
export class LeagueMember implements DbLeagueMember {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  leagueId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  isActive: boolean;

  @Field()
  isCommissioner: boolean;

  // NOTE - Field Resolvers

  @Field(() => User)
  user: User;

  @Field(() => Lineup, { nullable: true })
  lineup?: Lineup;

  @Field()
  isLineupSet: boolean;

  @Field(() => LeagueMemberScore)
  leagueMemberScore: LeagueMemberScore;
}

@InputType()
export class JoinLeagueInput {
  @Field(() => ID)
  leagueId: string;
}

@InputType()
export class QuitLeagueInput {
  @Field(() => ID)
  leagueId: string;
}

@InputType()
export class RemoveLeagueMemberInput {
  @Field(() => ID)
  leagueMemberId: string;
}
