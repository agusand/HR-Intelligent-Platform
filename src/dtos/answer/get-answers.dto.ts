import { ApiProperty } from "@nestjs/swagger";

export class GetAnswerDto {
  @ApiProperty()
  profile: string;

  @ApiProperty()
  questionId: {
    question: string;
    cryteria: string;
    id: number;
  };

  @ApiProperty()
  answer: string;
}
