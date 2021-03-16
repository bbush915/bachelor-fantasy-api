import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';

import { IContext } from 'gql/context';
import { LeagueMember } from 'gql/league-member';
import { Season } from 'gql/season';
import knex from 'lib/knex';
import { authentication } from 'middleware';
import { JoinLeagueInput, League } from './schema';

@Resolver(League)
class LeagueResolver {
  @Query(() => [League])
  @UseMiddleware(authentication)
  myLeagues(@Ctx() { identity }: IContext): Promise<League[]> {
    return knex
      .select('leagues.*')
      .from<League>('leagues')
      .join('league_members', 'league_members.league_id', '=', 'leagues.id')
      .where('league_members.user_id', '=', identity!.id);
  }

  @Query(() => League, { nullable: true })
  league(@Arg('id') id: string): Promise<League | undefined> {
    return knex.select().from<League>('leagues').where({ id }).first();
  }

  @Query(() => [League])
  leagues(@Arg('query') query: string): Promise<League[]> {
    return knex
      .select()
      .from<League>('leagues')
      .whereRaw(`leagues.name LIKE '%${query}%'`);
  }

  @Mutation(() => LeagueMember)
  @UseMiddleware(authentication)
  async joinLeague(
    @Arg('input') { leagueId }: JoinLeagueInput,
    @Ctx() { identity }: IContext
  ): Promise<LeagueMember> {
    let leagueMember = await knex
      .select()
      .from<LeagueMember>('league_members')
      .where({ leagueId, userId: identity!.id })
      .first();

    if (!leagueMember) {
      leagueMember = (
        await knex
          .insert({
            userId: identity!.id,
            leagueId,
          })
          .into('leagueMembers')
          .returning('*')
      )[0];
    }
    return leagueMember!;
  }

  @FieldResolver(() => Season)
  async season(@Root() { seasonId }: League): Promise<Season> {
    const season = await knex
      .select()
      .from<Season>('seasons')
      .where({ id: seasonId })
      .first();
    return season!;
  }

  @FieldResolver(() => [LeagueMember])
  leagueMembers(@Root() { id }: League): Promise<LeagueMember[]> {
    return knex
      .select()
      .from<LeagueMember>('league_members')
      .where({ leagueId: id });
  }

  @FieldResolver(() => LeagueMember, { nullable: true })
  @UseMiddleware(authentication)
  myLeagueMember(
    @Root() { id }: League,
    @Ctx() { identity }: IContext
  ): Promise<LeagueMember | undefined> {
    return knex
      .select()
      .from<LeagueMember>('league_members')
      .where({ leagueId: id, userId: identity!.id })
      .first();
  }

  @FieldResolver(() => LeagueMember)
  async commissioner(@Root() { id }: League): Promise<LeagueMember> {
    const commissioner = await knex
      .select()
      .from<LeagueMember>('league_members')
      .where({ leagueId: id, isCommissioner: true })
      .first();
    console.log(id, commissioner);
    return commissioner!;
  }
}

export default LeagueResolver;
