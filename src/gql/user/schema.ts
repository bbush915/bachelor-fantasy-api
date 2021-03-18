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
  hashedPassword: string;

  @Field()
  verifiedEmail: boolean;

  @Field()
  avatarUrl: string;

  @Field()
  displayName: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  displayName: string;

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

@InputType()
export class UpdateProfileInput {
  @Field()
  email: string;

  @Field()
  displayName: string;

  @Field()
  avatarUrl: string;
}
