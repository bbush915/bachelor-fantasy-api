import { Field, ID, InputType, ObjectType } from 'type-graphql';

import { LeagueMember } from 'gql/league-member';
import { Season } from 'gql/season';

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

  @Field(() => [LeagueMember])
  leagueMembers?: LeagueMember[];

  @Field(() => LeagueMember, { nullable: true })
  myLeagueMember?: LeagueMember;

  @Field(() => LeagueMember)
  commissioner?: LeagueMember;
}

@InputType()
export class JoinLeagueInput {
  @Field()
  leagueId: string;
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
