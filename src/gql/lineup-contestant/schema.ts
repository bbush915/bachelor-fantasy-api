import { Field, ID, Int, ObjectType } from "type-graphql";

import { Contestant } from "gql/contestant";
import { DbLineupContestant } from "types";

@ObjectType()
export class LineupContestant implements DbLineupContestant {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => ID)
  lineupId: string;

  @Field(() => ID)
  contestantId: string;

  // NOTE - Field Resolvers

  @Field(() => Contestant)
  contestant: Contestant;

  @Field(() => Int, { nullable: true })
  score?: number;
}
