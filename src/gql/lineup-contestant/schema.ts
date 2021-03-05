import { Field, ID, ObjectType } from "type-graphql";

import { Contestant } from "gql/contestant";

@ObjectType()
export class LineupContestant {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  lineupId: string;

  @Field(() => ID)
  contestantId: string;

  @Field(() => Contestant)
  contestant?: Contestant;
}
