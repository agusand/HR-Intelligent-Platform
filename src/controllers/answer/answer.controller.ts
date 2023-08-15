import { Controller, Post, Body, HttpException, HttpStatus, Get, Param } from "@nestjs/common";
import { InsertResult, QueryFailedError } from "typeorm";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateAnswerDto } from "dtos/answer/create-answer.dto";

import Answer from "entities/answer.entity";

import { AnswerService } from "services/answer/answer.service";

@ApiBearerAuth()
@ApiTags("Answer")
@Controller({ path: "answer" })
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @ApiOperation({ description: "Get answers by email" })
  @Get(":email")
  async getAnswers(@Param("email") email: string): Promise<Answer[]> {
    try {
      return await this.answerService.getAnswersByEmail(email);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  @ApiOperation({ description: "Add new answer" })
  @Post()
  async createAnswer(@Body() newAnswer: CreateAnswerDto): Promise<InsertResult> {
    try {
      return await this.answerService.createAnswer(newAnswer);
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
