import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";

import { IContext } from "gql/context";
import { LeagueMember } from "gql/league-member";
import { Season } from "gql/season";
import knex from "lib/knex";
import { authentication } from "middleware";
import { CreateLeagueInput, League } from "./schema";

@Resolver(League)
class LeagueResolver {
  @Query(() => [League])
  async leagues(@Arg("query") query: string): Promise<League[]> {
    const activeSeason = await knex
      .select()
      .from<Season>("seasons")
      .where({ isActive: true })
      .first();

    return knex
      .select()
      .from<League>("leagues")
      .where("seasonId", "=", activeSeason!.id)
      .andWhereRaw(`lower(leagues.name) LIKE '%${query.toLowerCase()}%'`);
  }

  @Query(() => League)
  async league(@Arg("id", () => ID) id: string): Promise<League> {
    const league = await knex.select().from<League>("leagues").where({ id }).first();

    if (!league) {
      throw new Error("League does not exist");
    }

    return league;
  }

  @Query(() => [League])
  @UseMiddleware(authentication)
  myLeagues(@Ctx() { identity }: IContext): Promise<League[]> {
    return knex
      .select("leagues.*")
      .from<League>("leagues")
      .join("league_members", "league_members.league_id", "=", "leagues.id")
      .where("league_members.user_id", "=", identity!.id);
  }

  @FieldResolver(() => Season)
  async season(@Root() { seasonId }: League): Promise<Season> {
    const season = await knex.select().from<Season>("seasons").where({ id: seasonId }).first();
    return season!;
  }

  @FieldResolver(() => [LeagueMember])
  leagueMembers(@Root() { id }: League): Promise<LeagueMember[]> {
    return knex.select().from<LeagueMember>("league_members").where({ leagueId: id });
  }

  @FieldResolver(() => LeagueMember)
  async commissioner(@Root() { id }: League): Promise<LeagueMember> {
    const commissioner = await knex
      .select()
      .from<LeagueMember>("league_members")
      .where({ leagueId: id, isCommissioner: true })
      .first();

    return commissioner!;
  }

  @FieldResolver(() => LeagueMember, { nullable: true })
  @UseMiddleware(authentication)
  myLeagueMember(
    @Root() { id }: League,
    @Ctx() { identity }: IContext
  ): Promise<LeagueMember | undefined> {
    return knex
      .select()
      .from<LeagueMember>("league_members")
      .where({ leagueId: id, userId: identity!.id })
      .first();
  }

  @Mutation(() => League)
  @UseMiddleware(authentication)
  async createLeague(
    @Arg("input")
    { name, description, logo, isPublic, isShareable }: CreateLeagueInput,
    @Ctx() { identity }: IContext
  ): Promise<League> {
    return knex.transaction(async (trx) => {
      const activeSeason = await trx
        .select()
        .from<Season>("seasons")
        .where({ isActive: true })
        .first();

      // TODO(Bryan) - Should store logo somewhere (S3 or local file system).
      // Currently keeping a data URL, which works, but ¯\_(ツ)_/¯

      const logoUrl = logo;

      const league: League = (
        await trx
          .insert({
            seasonId: activeSeason!.id,
            name,
            description,
            logoUrl,
            isPublic,
            isShareable,
          })
          .into("leagues")
          .returning("*")
      )[0];

      // The user who creates the league is the commissioner.

      const commissioner: Partial<LeagueMember> = {
        leagueId: league.id,
        userId: identity!.id,
        isCommissioner: true,
      };

      await trx.insert(commissioner).into("league_members");

      return league;
    });
  }
}

export default LeagueResolver;
