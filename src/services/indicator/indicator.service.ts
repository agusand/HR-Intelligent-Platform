import { InsertResult, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateIndicatorDto } from "dtos/indicator/create-indicator.dto";

import Indicator from "entities/indicator.entity";

@Injectable()
export class IndicatorService {
  constructor(@InjectRepository(Indicator) private indicatorRepository: Repository<Indicator>) {}

  createIndicators(indicatorList: CreateIndicatorDto[]): Promise<InsertResult> {
    return this.indicatorRepository.insert(indicatorList);
  }

  getIndicatorsByEmail(email: string): Promise<Indicator[]> {
    return this.indicatorRepository.find({ where: { profile: email } });
  }
}
