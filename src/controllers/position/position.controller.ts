import { Controller, Post, Body, Get, HttpException, HttpStatus } from "@nestjs/common";
import { InsertResult, QueryFailedError } from "typeorm";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { PositionService } from "services/position/position.service";

import { CreatePositionDto } from "dtos/position/create-position.dto";

import Position from "entities/position.entity";

@ApiBearerAuth()
@ApiTags("Positions")
@Controller({ path: "position" })
export class PositionController {
  constructor(private positionsService: PositionService) {}

  @ApiOperation({ description: "Get all positions" })
  @Get()
  async getPositions(): Promise<Position[]> {
    try {
      return await this.positionsService.getPositions();
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  @ApiOperation({ description: "Add new position" })
  @Post()
  async createPosition(@Body() newPosition: CreatePositionDto): Promise<InsertResult> {
    try {
      return await this.positionsService.createPosition(newPosition);
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
      }

      throw error;
    }
  }
}
