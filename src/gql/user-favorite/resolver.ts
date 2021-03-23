import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import knex from "lib/knex";
import { authentication } from "middleware";
import { UserFavoriteInput, UserFavorite } from "./schema";
import { Contestant } from "gql/contestant";

@Resolver(UserFavorite)
class UserFavoriteResolver {
  @Query(() => [UserFavorite])
  @UseMiddleware(authentication)
  myFavorites(@Ctx() { identity }: IContext): Promise<UserFavorite[]> {
    return knex.select().from<UserFavorite>("user_favorites").where({ userId: identity!.id });
  }

  @Mutation(() => Contestant)
  @UseMiddleware(authentication)
  async addFavorite(
    @Ctx() { identity }: IContext,
    @Arg("input") { contestantId }: UserFavoriteInput
  ): Promise<Contestant> {
    await knex.insert({ userId: identity!.id, contestantId }).into("user_favorites");

    const contestant = await knex
      .select()
      .from<Contestant>("contestants")
      .where({ id: contestantId })
      .first();

    return contestant!;
  }

  @Mutation(() => Contestant)
  @UseMiddleware(authentication)
  async removeFavorite(
    @Ctx() { identity }: IContext,
    @Arg("input") { contestantId }: UserFavoriteInput
  ): Promise<Contestant> {
    await knex.delete().where({ userId: identity!.id, contestantId }).from("user_favorites");

    const contestant = await knex
      .select()
      .from<Contestant>("contestants")
      .where({ id: contestantId })
      .first();

    return contestant!;
  }
}

export default UserFavoriteResolver;
