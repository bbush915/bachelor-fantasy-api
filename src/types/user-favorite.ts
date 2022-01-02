import { DbTimestamps } from "./base";

export interface DbUserFavorite extends DbTimestamps {
  id: string;
  userId: string;
  contestantId: string;
}
