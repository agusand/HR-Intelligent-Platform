import { DeepPartial } from "typeorm";

import Position from "entities/position.entity";
import Profile from "entities/profile.entity";

export interface PostulateProfileDto {
  positions: DeepPartial<Position>;
  profiles: DeepPartial<Profile>;
  scoring: number;
}
