import { DbTimestamps } from "./base";

export interface DbSeasonWeekContestant extends DbTimestamps {
  id: string;
  seasonWeekId: string;
  contestantId: string;
  rose?: boolean;
  specialRose?: boolean;
  groupDate?: boolean;
  oneOnOneDate?: boolean;
  twoOnOneDate?: boolean;
  sentHome?: boolean;
  score?: number;
}
