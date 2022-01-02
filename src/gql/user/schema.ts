import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";

import { DbUser } from "types";

@ObjectType()
export class User implements DbUser {
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

  @Field()
  sendLineupReminders: boolean;

  @Field()
  sendScoringRecaps: boolean;

  @Field()
  setRandomLineup: boolean;

  @Field()
  role: "admin" | "basic_user";
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

@ArgsType()
export class ValidateUserRoleInput {
  @Field()
  role: string;
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
export class ChangePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}

@InputType()
export class UpdateProfileInput {
  @Field()
  avatarUrl: string;

  @Field()
  displayName: string;

  @Field()
  email: string;

  @Field()
  sendLineupReminders: boolean;

  @Field()
  sendScoringRecaps: boolean;

  @Field()
  setRandomLineup: boolean;
}
