import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class OperationResponse {
  @Field()
  success: boolean;
}
