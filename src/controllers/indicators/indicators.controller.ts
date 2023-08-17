import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InsertResult, QueryFailedError } from "typeorm";

import { CreateIndicatorBody } from "dtos/indicator/create-indicator-body.dto";

import { IndicatorService } from "services/indicator/indicator.service";
import { OpenaiService } from "services/openai/openai.service";
import { ProfileService } from "services/profile/profile.service";

@ApiBearerAuth()
@ApiTags("Indicators")
@Controller("indicators")
export class IndicatorsController {
  constructor(private openaiService: OpenaiService, private indicatorService: IndicatorService, private profileService: ProfileService) {}

  @ApiOperation({ description: "Get indicators" })
  @Get(":email")
  async getIndicators(@Param("email") email: string) {
    try {
      return await this.indicatorService.getIndicatorsByEmail(email);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  @ApiOperation({ description: "Add new answer" })
  @Post()
  async createIndicators(@Body() { email, positionId }: CreateIndicatorBody): Promise<InsertResult> {
    try {
      const alreadyExists = await this.profileService.existsPostulation(email, positionId);

      if (!alreadyExists) {
        const averageImplementedResponse = await this.openaiService.processEveryAnswer(String(email), Number(positionId));
        const results = averageImplementedResponse.map((result) => ({ ...result, profile: String(email) }));
        await this.profileService.ponderateScoringAndPostulate(averageImplementedResponse, positionId, email);
        return await this.indicatorService.createIndicators(results);
      }

      return null;
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      if (error instanceof QueryFailedError) {
        if (error.driverError.code === "ER_NO_DEFAULT_FOR_FIELD") {
          throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (error.driverError.code === "ER_NO_REFERENCED_ROW_2") {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }

        if (error.driverError.code === "ER_DUP_ENTRY") {
          throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
      }

      throw error;
    }
  }
}
