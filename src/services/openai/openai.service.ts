import { Configuration, OpenAIApi } from "openai";
import { Injectable } from "@nestjs/common";

import { ParsedResponse, QuestionAnswerPair } from "./types";

import { AnswerService } from "services/answer/answer.service";
import { IndicatorService } from "services/indicator/indicator.service";
import { PositionService } from "services/position/position.service";
import { ProfileService } from "services/profile/profile.service";

@Injectable()
export class OpenaiService {
  private readonly configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly openai = new OpenAIApi(this.configuration);

  constructor(
    private readonly answerService: AnswerService,
    private readonly indicatorsService: IndicatorService,
    private readonly positionService: PositionService,
    private readonly profileService: ProfileService,
  ) {}

  async processAnswer(qaPair: QuestionAnswerPair, position: string, temperature = 0.1) {
    try {
      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: this.generatePrompt(qaPair.question.question, qaPair.answer, qaPair.question.cryteria, position),
        temperature,
      });
      return { cryteria: qaPair.question.cryteria, result: completion.data.choices[0].text.replace(/\D/g, "").slice(0, 2) };
    } catch (error) {
      console.log(error.message);
    }
  }

  generatePrompt(question: string, answer: string, cryteria: string, position: string) {
    return `Basado en la siguiente pregunta realizada a un usuario: "${question}",
    y la respectiva respuesta del usuario: "${answer}",
    brindame un numero del 00 al 99 que represente un puntaje que indique ${cryteria} sobre el perfil del usuario para la posicion ${position}. 
    Es importante que tu respuesta solo incluya el numero solicitado`;
  }

  async processEveryAnswer(email: string, position: number) {
    const currentIndicators = (await this.indicatorsService.getIndicatorsByEmail(email)).map((indicator) => indicator.indicator);
    const answers = await this.answerService.getAnswersWithQuestion(email, position);
    const positionElement = await this.positionService.getPositionById(position);

    const validAnswers = answers.filter((answer) => answer.questionId.cryteria !== "" && !currentIndicators.includes(answer.questionId.cryteria));

    const response = await Promise.all(
      validAnswers.map((answer) =>
        this.processAnswer(
          { question: { question: answer.questionId.question, cryteria: answer.questionId.cryteria }, answer: answer.answer },
          positionElement.name,
        ),
      ),
    );

    const parsedResponse: ParsedResponse[] = response.map((response) => {
      const value = parseInt(response?.result) + 1;
      return { indicator: response?.cryteria, value: isNaN(value) ? 1 : value };
    });

    const result: { [key: string]: { value: number; count: number } } = parsedResponse.reduce((prevValue, currentValue) => {
      const auxValue = { ...prevValue };

      if (Object.keys(auxValue).includes(currentValue.indicator)) {
        auxValue[currentValue.indicator].value += currentValue.value;
        auxValue[currentValue.indicator].count++;
      } else {
        auxValue[currentValue.indicator] = { value: currentValue.value, count: 1 };
      }

      return auxValue;
    }, {});

    const averageImplementedResponse: ParsedResponse[] = Object.keys(result).map((key) => {
      const newValue = { indicator: key, value: result[key].value / result[key].count };
      return newValue;
    });

    if (positionElement) {
      const recommendation = await this.askForRecommendation(averageImplementedResponse, positionElement.name);
      console.log(recommendation);
    }

    return averageImplementedResponse;
  }

  async askForRecommendation(averageImplementedResponse: ParsedResponse[], position: string) {
    const prompt = `Dada la siguiente lista de valores con sus respectivos criterios:
${averageImplementedResponse.reduce((acumulatedValue, currentResponse) => {
  return acumulatedValue + `${currentResponse.indicator}: ${currentResponse.value}\n`;
}, "")}
y teniendo en cuenta que parten de una lista de respuestas de un usuario postulante a la posicion ${position}, en base a un listado de preguntas realizadas al mismo
dame un consejo sobre como mejorar las postulaciones`;
    try {
      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 500,
      });
      +console.log(completion.data.choices.map((choice) => choice.text));
      return completion.data.choices[0].text;
    } catch (error) {
      console.log(error.message);
    }
  }
}
