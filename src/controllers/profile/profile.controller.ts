import { Controller, Post, Get, Body, HttpException, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { InsertResult, QueryFailedError, DeepPartial } from "typeorm";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateProfileDto } from "dtos/profile/create-profile.dto";
import { PostulateProfileDto } from "dtos/profile/postulate-profile.dto";

import Position from "entities/position.entity";

import { ProfileService } from "services/profile/profile.service";
import Profile from "entities/profile.entity";

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

  @ApiOperation({ description: "Postulate profile to position" })
  @Post("postulate")
  async postulateProfile(@Body() newPostulation: PostulateProfileDto): Promise<InsertResult> {
    try {
      return await this.profilesService.postulateProfile(newPostulation);
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

  @ApiOperation({ description: "Get profiles by position" })
  @Get(":position")
  async getProfilesByPosition(@Param("position", ParseIntPipe) position: DeepPartial<Position>) {
    try {
      let result = [];
      const profiles = await this.profilesService.getProfilesByPosition(position);
      if (profiles.length) {
        result = profiles.map((profile) => {
          const position = profile.position[0];

          if (!position) {
            return profile;
          }

          return { ...profile, position: position.positions, scoring: position.scoring };
        });
      }

      result.sort((a, b) => {
        if (Object.keys(a).includes("scoring") && Object.keys(b).includes("scoring")) return b.scoring - a.scoring;
        else return 0;
      });

      return result;
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  @ApiOperation({ description: "Get higher profiles" })
  @Post("higher")
  async getHigherProfiles(@Body() body: { min: number }): Promise<Profile[]> {
    try {
      const result = await this.profilesService.getHigherProfiles(body.min);

      return result;
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }
}
