import { ApiProperty } from "@nestjs/swagger";

export class CreateProfileDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  is_external: boolean;
}
