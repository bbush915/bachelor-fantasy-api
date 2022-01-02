import { DbTimestamps } from "./base";

export interface DbSeasonWeek extends DbTimestamps {
  id: string;
  seasonId: string;
  weekNumber: number;
  episodeAirDate: Date;
  lineupSpotsAvailable: number;
}
