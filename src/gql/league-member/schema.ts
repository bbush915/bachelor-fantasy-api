import { Field, ID, InputType, ObjectType } from "type-graphql";

import { LeagueMemberScore } from "gql/league-member-score";
import { Lineup } from "gql/lineup";
import { User } from "gql/user";

@ObjectType()
export class LeagueMember {
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

  @Field(() => User)
  user?: User;

  @Field(() => Lineup, { nullable: true })
  lineup?: Lineup;

  @Field()
  isLineupSet?: boolean;

  @Field(() => LeagueMemberScore)
  leagueMemberScore?: LeagueMemberScore;
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
