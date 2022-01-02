import { DbTimestamps } from "./base";

export interface DbLeague extends DbTimestamps {
  id: string;
  seasonId: string;
  name: string;
  description: string;
  logoUrl: string;
  isPublic: boolean;
  isShareable: boolean;
}
