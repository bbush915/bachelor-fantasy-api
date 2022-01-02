import { DbTimestamps } from "./base";

export interface DbLineup extends DbTimestamps {
  id: string;
  leagueMemberId: string;
  seasonWeekId: string;
}
