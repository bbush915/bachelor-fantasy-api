import { DbTimestamps } from "./base";

export interface DbSeason extends DbTimestamps {
  id: string;
  currentWeekNumber: number;
  seriesName: string;
  seasonNumber: number;
  isActive: boolean;
  isComplete: boolean;
}
