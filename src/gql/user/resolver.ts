import { ApolloError } from "apollo-server-errors";
import { compare, hash } from "bcryptjs";
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import configuration from "configuration";
import { IContext } from "gql/context";
import { OperationResponse } from "gql/utils";
import { decode, encode } from "lib/jwt";
import knex from "lib/knex";
import { EmailTemplates, sendEmail } from "lib/send-grid";
import { authentication } from "middleware";
import { DbUser } from "types";
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  TokenResponse,
  UpdateProfileInput,
  User,
  ValidateUserRoleInput,
  VerifyInput,
  VerifyResponse,
} from "./schema";

@Resolver(User)
class UserResolver {
  @Query(() => User)
  @UseMiddleware(authentication)
  async me(@Ctx() { identity }: IContext): Promise<DbUser> {
    const user = await knex.select().from<DbUser>("users").where({ id: identity!.id }).first();
    return user!;
  }

  @Query(() => OperationResponse)
  @UseMiddleware(authentication)
  validateUserRole(
    @Args() { role }: ValidateUserRoleInput,
    @Ctx() { identity }: IContext
  ): OperationResponse {
    return {
      success: identity!.role === role,
    };
  }

  @Mutation(() => User)
  async register(@Arg("input") { email, displayName, password }: RegisterInput): Promise<DbUser> {
    const existingUser = await knex.select().from<DbUser>("users").where({ email }).first();

    if (existingUser) {
      throw new ApolloError(
        `A user with that email address already exists.`,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = (
      await knex<DbUser>("users").insert({ email, displayName, hashedPassword }).returning("*")
    )[0];

    await this._sendVerificationEmail(user);

    return user;
  }

  @Mutation(() => OperationResponse)
  async sendVerificationEmail(@Arg("email") email: string): Promise<OperationResponse> {
    const user = await knex.select().from<DbUser>("users").where({ email }).first();

    await this._sendVerificationEmail(user!);

    return {
      success: true,
    };
  }

  @Mutation(() => VerifyResponse)
  async verify(@Arg("input") { token }: VerifyInput): Promise<VerifyResponse> {
    const { action, payload }: any = decode(token);

    if (action !== "verify-user") {
      throw new ApolloError("Invalid token.", "INVALID_TOKEN");
    }

    const { userId } = payload;

    const user = (
      await knex<DbUser>("users")
        .update({ isEmailVerified: true })
        .where({ id: userId })
        .returning("*")
    )[0];

    return {
      token: encode({ id: userId, role: user.role }),
      email: user.email,
    };
  }

  @Mutation(() => TokenResponse)
  async login(@Arg("input") { email, password }: LoginInput): Promise<TokenResponse> {
    const user = await knex.select().from<DbUser>("users").where({ email }).first();

    if (!user || !(await compare(password, user.hashedPassword))) {
      throw new ApolloError(
        "Invalid credentials. The email or password are incorrect",
        "INVALID_CREDENTIALS"
      );
    }

    if (!user.isEmailVerified) {
      throw new ApolloError("User has not verified their email address.", "UNVERIFIED_USER");
    }

    const token = encode({ id: user.id, role: user.role });
    return { token };
  }

  @Mutation(() => OperationResponse)
  async sendPasswordResetEmail(@Arg("email") email: string): Promise<OperationResponse> {
    const user = await knex.select().from<DbUser>("users").where({ email }).first();

    if (user) {
      await this._sendPasswordResetEmail(user);
    }

    return {
      success: true,
    };
  }

  @Mutation(() => OperationResponse)
  async resetPassword(
    @Arg("input") { token, password }: ResetPasswordInput
  ): Promise<OperationResponse> {
    const { action, payload }: any = decode(token);

    if (action !== "reset-password") {
      throw new ApolloError("Invalid token.", "INVALID_TOKEN");
    }

    const { userId } = payload;

    const hashedPassword = await hash(password, 12);
    await knex<DbUser>("users").update({ hashedPassword }).where({ id: userId });

    return {
      success: true,
    };
  }

  @Mutation(() => OperationResponse)
  @UseMiddleware(authentication)
  async changePassword(
    @Arg("input") { newPassword, currentPassword }: ChangePasswordInput,
    @Ctx() { identity }: IContext
  ): Promise<OperationResponse> {
    const user = await knex.select().from<DbUser>("users").where({ id: identity!.id }).first();

    if (!(await compare(currentPassword, user!.hashedPassword))) {
      throw new ApolloError(
        "Invalid credentials. The email or password are incorrect",
        "INVALID_CREDENTIALS"
      );
    }

    const hashedPassword = await hash(newPassword, 12);
    await knex<DbUser>("users").update({ hashedPassword }).where({ id: user!.id });

    return {
      success: true,
    };
  }

  @Mutation(() => User)
  @UseMiddleware(authentication)
  async updateProfile(
    @Arg("input")
    {
      email,
      displayName,
      avatarUrl,
      sendLineupReminders,
      sendScoringRecaps,
      setRandomLineup,
    }: UpdateProfileInput,
    @Ctx() { identity }: IContext
  ): Promise<DbUser> {
    const existingUser = await knex
      .select()
      .from<DbUser>("users")
      .where({ email })
      .andWhereNot({ id: identity!.id })
      .first();

    if (existingUser) {
      throw new ApolloError(
        `A user with that email address already exists.`,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    return (
      await knex<DbUser>("users")
        .update({
          email,
          displayName,
          avatarUrl,
          sendLineupReminders,
          sendScoringRecaps,
          setRandomLineup,
        })
        .where({ id: identity!.id })
        .returning("*")
    )[0];
  }

  private async _sendVerificationEmail({ id, email, role }: DbUser) {
    const token = encode(
      { action: "verify-user", payload: { userId: id, role } },
      14 * 24 * 60 * 60 // Two weeks
    );

    return sendEmail(EmailTemplates.VerifyEmail, {
      to: email,
      link: encodeURI(`${configuration.client.host}/verification?token=${token}`),
    });
  }

  private async _sendPasswordResetEmail({ id, email, role }: DbUser) {
    const token = encode(
      { action: "reset-password", payload: { userId: id, role } },
      14 * 24 * 60 * 60 // Two weeks
    );

    return sendEmail(EmailTemplates.ResetPassword, {
      to: email,
      link: encodeURI(`${configuration.client.host}/reset-password?token=${token}`),
    });
  }
}

export default UserResolver;
