import { Arg, Ctx, FieldResolver, ID, Query, Resolver, Root, UseMiddleware } from "type-graphql";

import { Season } from "gql/season";
import knex from "lib/knex";
import { Contestant } from "./schema";
import { UserFavorite } from "gql/user-favorite";
import { IContext } from "gql/context";
import { authentication } from "middleware";

@Resolver(Contestant)
class ContestantResolver {
  @Query(() => [Contestant])
  async allContestants(): Promise<Contestant[]> {
    const activeSeason = await knex
      .select()
      .from<Season>("seasons")
      .where({ isActive: true })
      .first();

    return knex.select().from<Contestant>("contestants").where({ seasonId: activeSeason!.id });
  }

  @Query(() => [Contestant])
  async weeklyContestants(
    @Arg("seasonWeekId", () => ID) seasonWeekId: string
  ): Promise<Contestant[]> {
    const activeSeason = await knex
      .select()
      .from<Season>("seasons")
      .where({ isActive: true })
      .first();

    return knex
      .select("contestants.*")
      .from<Contestant>("contestants")
      .join("season_week_contestants", (joinBuilder) =>
        joinBuilder
          .on("season_week_contestants.season_week_id", "=", knex.raw("?", [seasonWeekId]))
          .andOn("season_week_contestants.contestant_id", "=", "contestants.id")
      )
      .where({ seasonId: activeSeason!.id });
  }

  @FieldResolver(() => Boolean)
  @UseMiddleware(authentication)
  async isFavorite(@Root() { id }: Contestant, @Ctx() { identity }: IContext): Promise<boolean> {
    const userFavorite = await knex
      .select()
      .from<UserFavorite>("user_favorites")
      .where({ userId: identity!.id, contestantId: id })
      .first();

    return userFavorite ? true : false;
  }
}

export default ContestantResolver;
