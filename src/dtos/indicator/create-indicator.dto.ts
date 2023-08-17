import { ApiProperty } from "@nestjs/swagger";

export class CreateIndicatorDto {
  @ApiProperty()
  profile: string;

  @ApiProperty()
  indicator: string;

  @ApiProperty()
  value: number;
}
