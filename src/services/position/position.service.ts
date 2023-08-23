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

  async getPositions(): Promise<(Position & { profilesScoring: number[] })[]> {
    const result = await this.positionRepository.find({ relations: ["profiles"] });
    const newResult: (Position & { profilesScoring: number[] })[] = result.map(
      (position) =>
        ({
          ...position,
          profilesScoring: position.profiles.map((profile) => profile.scoring),
        } as Position & {
          profilesScoring: number[];
        }),
    );
    return newResult;
  }

  getPositionById(positionId: number): Promise<Position> {
    return this.positionRepository.findOne({ where: { id: positionId } });
  }
}
