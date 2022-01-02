import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import knex from "lib/knex";
import { authentication } from "middleware";
import { DbUserFavorite } from "types";
import { ToggleUserFavoriteInput, UserFavorite } from "./schema";

@Resolver(UserFavorite)
class UserFavoriteResolver {
  @Query(() => [UserFavorite])
  @UseMiddleware(authentication)
  myFavorites(@Ctx() { identity }: IContext): Promise<DbUserFavorite[]> {
    return knex.select().from<DbUserFavorite>("user_favorites").where({ userId: identity!.id });
  }

  @Mutation(() => UserFavorite)
  @UseMiddleware(authentication)
  async addFavorite(
    @Ctx() { identity }: IContext,
    @Arg("input") { contestantId }: ToggleUserFavoriteInput
  ): Promise<DbUserFavorite> {
    return (
      await knex<DbUserFavorite>("user_favorites")
        .insert({ userId: identity!.id, contestantId })
        .returning("*")
    )[0];
  }

  @Mutation(() => UserFavorite)
  @UseMiddleware(authentication)
  async removeFavorite(
    @Ctx() { identity }: IContext,
    @Arg("input") { contestantId }: ToggleUserFavoriteInput
  ): Promise<DbUserFavorite> {
    return (
      await knex<DbUserFavorite>("user_favorites")
        .delete()
        .where({ userId: identity!.id, contestantId })
        .returning("*")
    )[0];
  }
}

export default UserFavoriteResolver;
