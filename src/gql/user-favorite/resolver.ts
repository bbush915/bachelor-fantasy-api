import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { IContext } from "gql/context";
import knex from "lib/knex";
import { authentication } from "middleware";
import { UserFavorite } from "./schema";

@Resolver(UserFavorite)
class UserFavoriteResolver {
  @Query(() => [UserFavorite])
  @UseMiddleware(authentication)
  myFavorites(@Ctx() { identity }: IContext): Promise<UserFavorite[]> {
    return knex("user_favorites").where({ userId: identity!.id });
  }
}

export default UserFavoriteResolver;
