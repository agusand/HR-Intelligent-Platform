import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";

import { CreatePositionDto } from "dtos/position/create-position.dto";

import Position from "entities/position.entity";

@Injectable()
export class PositionService {
  constructor(@InjectRepository(Position) private positionRepository: Repository<Position>) {}

  createPosition(position: CreatePositionDto): Promise<InsertResult> {
    return this.positionRepository.insert(position);
  }

  getPositions(): Promise<Position[]> {
    return this.positionRepository.find();
  }

  getPositionById(positionId: number): Promise<Position> {
    return this.positionRepository.findOne({ where: { id: positionId } });
  }
}
