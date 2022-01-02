import { DbTimestamps } from "./base";

export interface DbUser extends DbTimestamps {
  id: string;
  email: string;
  hashedPassword: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  displayName: string;
  sendLineupReminders: boolean;
  sendScoringRecaps: boolean;
  setRandomLineup: boolean;
  role: "admin" | "basic_user";
}
