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
import { PositionController } from "controllers/position/position.controller";

import Question from "entities/question.entity";
import Profile from "entities/profile.entity";
import Answer from "entities/answer.entity";
import Indicator from "entities/indicator.entity";
import Position from "entities/position.entity";
import PositionProfile from "entities/position-profile.entity";

import { MigrationsService } from "services/migrations/migrations.service";
import { QuestionService } from "services/question/question.service";
import { ProfileService } from "services/profile/profile.service";
import { AnswerService } from "services/answer/answer.service";
import { OpenaiService } from "services/openai/openai.service";
import { IndicatorService } from "services/indicator/indicator.service";
import { PositionService } from "services/position/position.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TypeOrmModule.forFeature([Question, Profile, Answer, Indicator, Position, PositionProfile]),
  ],
  controllers: [AppController, QuestionController, ProfileController, AnswerController, IndicatorsController, PositionController],
  providers: [AppService, MigrationsService, QuestionService, ProfileService, AnswerService, OpenaiService, IndicatorService, PositionService],
})
export class AppModule {}
