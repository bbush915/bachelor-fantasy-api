import { DbTimestamps } from "./base";

export interface DbContestant extends DbTimestamps {
  id: string;
  seasonId: string;
  name: string;
  headshotUrl: string;
  age: number;
  occupation: string;
  hometown: string;
  bio: string;
  trivia: string[];
}
