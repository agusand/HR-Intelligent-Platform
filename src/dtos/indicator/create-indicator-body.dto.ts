import { DeepPartial } from "typeorm";

import Position from "entities/position.entity";
import Profile from "entities/profile.entity";

export type CreateIndicatorBody = { email: DeepPartial<Profile>; positionId: DeepPartial<Position> };
