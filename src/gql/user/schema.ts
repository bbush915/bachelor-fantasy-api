import { ArgsType, Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  hashedPassword: string;
}

@ArgsType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@ArgsType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;
}
