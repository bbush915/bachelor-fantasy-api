import { DbTimestamps } from "./base";

export interface DbLineupContestant extends DbTimestamps {
  id: string;
  lineupId: string;
  contestantId: string;
}
