import { Controller, Post, Body, Get, HttpException, HttpStatus } from "@nestjs/common";
import { InsertResult, QueryFailedError } from "typeorm";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { QuestionService } from "services/question/question.service";

import { CreateQuestionDto } from "dtos/question/create-question.dto";

import Question from "entities/question.entity";

@ApiBearerAuth()
@ApiTags("Questions")
@Controller({ path: "question" })
export class QuestionController {
  constructor(private questionsService: QuestionService) {}

  @ApiOperation({ description: "Get all questions" })
  @Get()
  async getQuestions(): Promise<Question[]> {
    try {
      return await this.questionsService.getQuestions();
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }

  @ApiOperation({ description: "Add new question" })
  @Post()
  async createQuestion(@Body() newQuestion: CreateQuestionDto): Promise<InsertResult> {
    try {
      return await this.questionsService.createQuestion(newQuestion);
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
