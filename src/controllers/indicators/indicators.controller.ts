import { Controller, Get, HttpException, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { OpenaiService } from "services/openai/openai.service";

@Controller("indicators")
export class IndicatorsController {
  constructor(private openaiService: OpenaiService) {}

  @ApiOperation({ description: "Get indicators" })
  @Get(":email")
  async getIndicators(@Param("email") email: string) {
    try {
      return await this.openaiService.processEveryAnswer(email);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.error(error);

      if (error instanceof HttpException) throw error;

      throw error;
    }
  }
}
