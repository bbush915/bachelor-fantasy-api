import { ApolloError } from "apollo-server-errors";
import { compare, hash } from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import configuration from "configuration";
import { IContext } from "gql/context";
import { OperationResponse } from "gql/utils";
import { decode, encode } from "lib/jwt";
import knex from "lib/knex";
import { EmailTemplates, sendEmail } from "lib/send-grid";
import { authentication } from "middleware";
import {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  TokenResponse,
  User,
  UpdateProfileInput,
  VerifyInput,
  VerifyResponse,
} from "./schema";

@Resolver(User)
class UserResolver {
  @Query(() => User)
  @UseMiddleware(authentication)
  async me(@Ctx() { identity }: IContext): Promise<User> {
    const user = await knex.select().from<User>("users").where({ id: identity!.id }).first();
    return user!;
  }

  @Mutation(() => User)
  async register(@Arg("input") { email, displayName, password }: RegisterInput): Promise<User> {
    const existingUser = await knex.select().from<User>("users").where({ email }).first();

    if (existingUser) {
      throw new ApolloError(
        `A user with that email address already exists.`,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = (
      await knex.insert({ email, displayName, hashedPassword }).into("users").returning("*")
    )[0];

    await this._sendVerificationEmail(user);

    return user;
  }

  @Mutation(() => OperationResponse)
  async sendVerificationEmail(@Arg("email") email: string): Promise<OperationResponse> {
    const user = await knex.select().from<User>("users").where({ email }).first();

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
      await knex<User>("users")
        .update({ isEmailVerified: true })
        .where({ id: userId })
        .returning("*")
    )[0];

    return {
      token: encode({ id: userId }),
      email: user.email,
    };
  }

  @Mutation(() => TokenResponse)
  async login(@Arg("input") { email, password }: LoginInput): Promise<TokenResponse> {
    const user = await knex.select().from<User>("users").where({ email }).first();

    if (!user || !(await compare(password, user.hashedPassword))) {
      throw new ApolloError(
        "Invalid credentials. The email or password are incorrect",
        "INVALID_CREDENTIALS"
      );
    }

    if (!user.isEmailVerified) {
      throw new ApolloError("User has not verified their email address.", "UNVERIFIED_USER");
    }

    const token = encode({ id: user.id });
    return { token };
  }

  @Mutation(() => OperationResponse)
  async sendPasswordResetEmail(@Arg("email") email: string): Promise<OperationResponse> {
    const user = await knex.select().from<User>("users").where({ email }).first();

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
    await knex<User>("users").update({ hashedPassword }).where({ id: userId });

    return {
      success: true,
    };
  }

  @Mutation(() => User)
  @UseMiddleware(authentication)
  async updateProfile(
    @Arg("input")
    { email, displayName, avatarUrl, sendLineupReminders, sendScoringRecaps }: UpdateProfileInput,
    @Ctx() { identity }: IContext
  ): Promise<User> {
    const existingUser = await knex
      .select()
      .from<User>("users")
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
      await knex<User>("users")
        .update({ email, displayName, avatarUrl, sendLineupReminders, sendScoringRecaps })
        .where({ id: identity!.id })
        .returning("*")
    )[0];
  }

  private async _sendVerificationEmail({ id, email }: User) {
    const token = encode(
      { action: "verify-user", payload: { userId: id } },
      14 * 24 * 60 * 60 // Two weeks
    );

    return sendEmail(EmailTemplates.VerifyEmail, {
      to: email,
      link: encodeURI(`${configuration.client.host}/verification?token=${token}`),
    });
  }

  private async _sendPasswordResetEmail({ id, email }: User) {
    const token = encode(
      { action: "reset-password", payload: { userId: id } },
      14 * 24 * 60 * 60 // Two weeks
    );

    return sendEmail(EmailTemplates.ResetPassword, {
      to: email,
      link: encodeURI(`${configuration.client.host}/reset-password?token=${token}`),
    });
  }
}

export default UserResolver;
