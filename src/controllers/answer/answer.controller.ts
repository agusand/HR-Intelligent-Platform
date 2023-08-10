import { Controller, Post, Body, Delete, Param, ParseIntPipe, HttpException, HttpStatus } from "@nestjs/common";
import { DeleteResult, InsertResult, QueryFailedError } from "typeorm";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateAnswerDto } from "dtos/create-answer.dto";

import { AnswerService } from "services/answer/answer.service";

@ApiBearerAuth()
@ApiTags("Answer")
@Controller({ path: "answer" })
export class AnswerController {
  constructor(private answerService: AnswerService) {}

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
      }

      throw error;
    }
  }

  @ApiOperation({ description: "Delete answer" })
  @Delete(":id")
  async deleteAnswer(@Param("id", ParseIntPipe) id: number): Promise<DeleteResult> {
    try {
      const result = await this.answerService.deleteAnswer(id);

      if (result.affected === 0) throw new HttpException(`Answer with id ${id} not found`, HttpStatus.NOT_FOUND);

      return result;
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;
    }
  }
}
