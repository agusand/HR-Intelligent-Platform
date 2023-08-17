import { ApiProperty } from "@nestjs/swagger";

export class CreateAnswerDto {
  @ApiProperty({ example: "nombre.apellido@domain.com" })
  profile: string;

  @ApiProperty()
  questionId: number;

  @ApiProperty()
  answer: string;
}
