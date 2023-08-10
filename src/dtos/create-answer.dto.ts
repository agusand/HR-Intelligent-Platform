import { DeepPartial } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import Profile from "entities/profile.entity";

export class CreateAnswerDto {
  @ApiProperty({ type: "string", example: "nombre.apellido@domain.com" })
  profile: DeepPartial<Profile>;

  @ApiProperty()
  questionId: number;

  @ApiProperty()
  answer: string;
}
