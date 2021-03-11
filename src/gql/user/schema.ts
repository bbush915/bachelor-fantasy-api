import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  hashedPassword: string;

  @Field()
  avatarUrl: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
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
