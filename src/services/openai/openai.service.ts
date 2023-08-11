import { Configuration, OpenAIApi } from "openai";
import { Injectable } from "@nestjs/common";

import { QuestionAnswerPair } from "./types";

import { AnswerService } from "services/answer/answer.service";

@Injectable()
export class OpenaiService {
  private readonly configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly openai = new OpenAIApi(this.configuration);

  constructor(private readonly answerService: AnswerService) {}

  async processAnswer(qaPair: QuestionAnswerPair, temperature = 0.1) {
    try {
      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: this.generatePrompt(qaPair.question.question, qaPair.answer, qaPair.question.cryteria),
        temperature,
      });
      return { cryteria: qaPair.question.cryteria, result: completion.data.choices[0].text.replace(/\D/g, "-").split("-")[0] };
    } catch (error) {
      console.log(error);
    }
  }

  generatePrompt(question: string, answer: string, cryteria: string) {
    return `Basado en la siguiente pregunta realizada a un usuario: "${question}",
    y la respectiva respuesta del usuario: "${answer}",
    brindame un numero del 00 al 99 que represente un KPI que indique ${cryteria} sobre el perfil del usuario.`;
  }

  async processEveryAnswer(email: string) {
    const answers = await this.answerService.getAnswersFromAnUser(email);

    const validAnswers = answers.filter((answer) => answer.questionId.cryteria !== "");

    const response = await Promise.all(
      validAnswers.map((answer) =>
        this.processAnswer({ question: { question: answer.questionId.question, cryteria: answer.questionId.cryteria }, answer: answer.answer }),
      ),
    );

    const parsedResponse = response.map(({ cryteria, result }) => ({ cryteria, result: parseInt(result) + 1 }));

    return parsedResponse;
  }
}
