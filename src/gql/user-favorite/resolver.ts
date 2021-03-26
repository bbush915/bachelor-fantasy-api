import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import knex from "lib/knex";
import { authentication } from "middleware";
import { ToggleUserFavoriteInput, UserFavorite } from "./schema";

@Resolver(UserFavorite)
class UserFavoriteResolver {
  @Query(() => [UserFavorite])
  @UseMiddleware(authentication)
  myFavorites(@Ctx() { identity }: IContext): Promise<UserFavorite[]> {
    return knex.select().from<UserFavorite>("user_favorites").where({ userId: identity!.id });
  }

  @Mutation(() => UserFavorite)
  @UseMiddleware(authentication)
  async addFavorite(
    @Ctx() { identity }: IContext,
    @Arg("input") { contestantId }: ToggleUserFavoriteInput
  ): Promise<UserFavorite> {
    return (
      await knex
        .insert({ userId: identity!.id, contestantId })
        .into("user_favorites")
        .returning("*")
    )[0];
  }

  @Mutation(() => UserFavorite)
  @UseMiddleware(authentication)
  async removeFavorite(
    @Ctx() { identity }: IContext,
    @Arg("input") { contestantId }: ToggleUserFavoriteInput
  ): Promise<UserFavorite> {
    return (
      await knex
        .delete()
        .from<UserFavorite>("user_favorites")
        .where({ userId: identity!.id, contestantId })
        .returning("*")
    )[0];
  }
}

export default UserFavoriteResolver;
