import { compare, hash } from "bcryptjs";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import { encode } from "lib/jwt";
import knex from "lib/knex";
import { authentication } from "middleware";
import { LoginInput, LoginResponse, RegisterInput, User, UpdateProfileInput } from "./schema";
import { KnownTypeNamesRule } from "graphql";

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
    const user = await knex.select().from<User>("users").where({ email }).first();

    if (user) {
      throw new Error(`A user with the email [${email}] already exists`);
    }

    const hashedPassword = await hash(password, 12);

    return (
      await knex.insert({ email, displayName, hashedPassword }).into("users").returning("*")
    )[0];
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("input") { email, password }: LoginInput): Promise<LoginResponse> {
    const user = await knex.select().from<User>("users").where({ email }).first();

    if (!user || !(await compare(password, user.hashedPassword))) {
      throw new Error("Invalid credentials. The email or password are incorrect");
    }

    const token = encode({ id: user.id });
    return { token };
  }

  @Mutation(() => User)
  @UseMiddleware(authentication)
  async updateProfile(
    @Arg("input") { email, displayName, avatarUrl }: UpdateProfileInput,
    @Ctx() { identity }: IContext
  ): Promise<User> {
    return (
      await knex("users")
        .update({ email, displayName, avatarUrl })
        .where({ id: identity!.id })
        .returning("*")
    )[0];
  }
}

export default UserResolver;
