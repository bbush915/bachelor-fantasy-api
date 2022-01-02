import { DbTimestamps } from "./base";

export interface DbLeagueMember extends DbTimestamps {
  id: string;
  leagueId: string;
  userId: string;
  isActive: boolean;
  isCommissioner: boolean;
}
