import { CreateIndicatorDto } from "dtos/indicator/create-indicator.dto";

export type Question = { question: string; cryteria: string };

export type QuestionAnswerPair = { question: Question; answer: string };

export type ParsedResponse = Omit<CreateIndicatorDto, "profile">;
