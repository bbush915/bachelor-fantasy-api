import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class LineupContestant {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  lineupId: string;

  @Field(() => ID)
  contestantId: string;
}
