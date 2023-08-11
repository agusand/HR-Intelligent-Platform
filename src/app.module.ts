import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { typeOrmAsyncConfig } from "config/typeorm.config";

import { QuestionController } from "controllers/question/question.controller";
import { ProfileController } from "controllers/profile/profile.controller";
import { AnswerController } from "controllers/answer/answer.controller";
import { IndicatorsController } from "controllers/indicators/indicators.controller";

import Question from "entities/question.entity";
import Profile from "entities/profile.entity";
import Answer from "entities/answer.entity";

import { MigrationsService } from "services/migrations/migrations.service";
import { QuestionService } from "services/question/question.service";
import { ProfileService } from "services/profile/profile.service";
import { AnswerService } from "services/answer/answer.service";
import { OpenaiService } from "services/openai/openai.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRootAsync(typeOrmAsyncConfig), TypeOrmModule.forFeature([Question, Profile, Answer])],
  controllers: [AppController, QuestionController, ProfileController, AnswerController, IndicatorsController],
  providers: [AppService, MigrationsService, QuestionService, ProfileService, AnswerService, OpenaiService],
})
export class AppModule {}
