import { Field, ID, Int, ObjectType } from "type-graphql";

import { Contestant } from "gql/contestant";

@ObjectType()
export class SeasonWeekContestant {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => ID)
  seasonWeekId: string;

  @Field(() => ID)
  contestantId: string;

  @Field(() => Contestant)
  contestant?: Contestant;

  @Field({ nullable: true })
  rose?: boolean;

  @Field({ nullable: true })
  specialRose?: boolean;

  @Field({ nullable: true })
  groupDate?: boolean;

  @Field({ nullable: true })
  oneOnOneDate?: boolean;

  @Field({ nullable: true })
  twoOnOneDate?: boolean;

  @Field({ nullable: true })
  sentHome?: boolean;

  @Field(() => Int, { nullable: true })
  score?: number;
}
