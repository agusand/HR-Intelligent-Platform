import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppService } from "./app.service";
import { MigrationsService } from "services/migrations/migrations.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly migrationsService: MigrationsService) {
    this.runMigrations();
  }

  @ApiTags("Hello!")
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async runMigrations() {
    try {
      return await this.migrationsService.runMigrations();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }
}
