import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { InsertResult, QueryFailedError } from "typeorm";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateProfileDto } from "dtos/create-profile.dto";

import { ProfileService } from "services/profile/profile.service";

@ApiBearerAuth()
@ApiTags("Profiles")
@Controller({ path: "profile" })
export class ProfileController {
  constructor(private profilesService: ProfileService) {}

  @ApiOperation({ description: "Create new profile" })
  @Post()
  async createProfile(@Body() newProfile: CreateProfileDto): Promise<InsertResult> {
    try {
      return await this.profilesService.createProfile(newProfile);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      if (error instanceof QueryFailedError) {
        if (error.driverError.code === "ER_DUP_ENTRY") {
          throw new HttpException(error.message, HttpStatus.CONFLICT);
        }

        if (error.driverError.code === "ER_NO_DEFAULT_FOR_FIELD") {
          throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (error.driverError.code === "ER_NO_REFERENCED_ROW_2") {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
      }

      throw error;
    }
  }
}
