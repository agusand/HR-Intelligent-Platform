import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, InsertResult, Repository } from "typeorm";

import { CreateAnswerDto } from "dtos/create-answer.dto";

import Answer from "entities/answer.entity";

@Injectable()
export class AnswerService {
  constructor(@InjectRepository(Answer) private answerRepository: Repository<Answer>) {}

  createAnswer(answer: CreateAnswerDto): Promise<InsertResult> {
    return this.answerRepository.insert(answer);
  }

  deleteAnswer(id: number): Promise<DeleteResult> {
    return this.answerRepository.delete({ id });
  }
}
