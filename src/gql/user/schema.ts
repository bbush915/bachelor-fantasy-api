import { Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  email: string;

  @Field()
  hashedPassword: string;

  @Field()
  isEmailVerified: boolean;

  @Field({ nullable: true })
  avatarUrl?: string;

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
export class VerifyInput {
  @Field()
  token: string;
}

@ObjectType()
export class TokenResponse {
  @Field()
  token: string;
}

@ObjectType()
export class VerifyResponse extends TokenResponse {
  @Field()
  email: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
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
