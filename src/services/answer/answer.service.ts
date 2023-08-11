import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";

import { CreateAnswerDto } from "dtos/answer/create-answer.dto";

import Answer from "entities/answer.entity";
import { GetAnswerDto } from "dtos/answer/get-answers.dto";

@Injectable()
export class AnswerService {
  constructor(@InjectRepository(Answer) private answerRepository: Repository<Answer>) {}

  createAnswer(answer: CreateAnswerDto): Promise<InsertResult> {
    return this.answerRepository.insert(answer);
  }

  getAnswersFromAnUser(email: string): Promise<GetAnswerDto[]> {
    return this.answerRepository.find({ where: { profile: email }, relations: ["questionId"] }) as unknown as Promise<GetAnswerDto[]>;
  }
}
