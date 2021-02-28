import { compare, hash } from "bcryptjs";
import { Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import { encode } from "lib/jwt";
import knex from "lib/knex";
import { authentication } from "middleware";
import { LoginInput, LoginResponse, RegisterInput, User } from "./schema";

@Resolver(User)
class UserResolver {
  @Query(() => User)
  @UseMiddleware(authentication)
  me(@Ctx() { identity }: IContext): Promise<User> {
    return knex("users").where({ id: identity!.id }).first();
  }

  @Mutation(() => User)
  async register(@Args() { email, username, password }: RegisterInput): Promise<User> {
    const existingUser: User = await knex("users").where({ email }).first();

    if (existingUser) {
      throw new Error(`A user with the email [${email}] already exists`);
    }

    const hashedPassword = await hash(password, 12);

    const records = await knex("users").insert({ email, username, hashed_password: hashedPassword }).returning("*");
    return records[0];
  }

  @Mutation(() => LoginResponse)
  async login(@Args() { email, password }: LoginInput): Promise<LoginResponse> {
    const user: User = await knex("users").where({ email }).first();

    if (!user || !(await compare(password, user.hashed_password))) {
      throw new Error("Invalid credentials. The email or password are incorrect");
    }

    const token = encode({ id: user.id });
    return { token };
  }
}

export default UserResolver;
