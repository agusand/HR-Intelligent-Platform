import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";

import { CreateQuestionDto } from "dtos/create-question.dto";

import Question from "entities/question.entity";

@Injectable()
export class QuestionService {
  constructor(@InjectRepository(Question) private questionRepository: Repository<Question>) {}

  createQuestion(question: CreateQuestionDto): Promise<InsertResult> {
    return this.questionRepository.insert(question);
  }

  getQuestions(): Promise<Question[]> {
    return this.questionRepository.find();
  }
}
