import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, InsertResult, Repository } from "typeorm";

import { CreateProfileDto } from "dtos/profile/create-profile.dto";
import { PostulateProfileDto } from "dtos/profile/postulate-profile.dto";

import Position from "entities/position.entity";
import Profile from "entities/profile.entity";
import PositionProfile from "entities/position-profile.entity";

import { ParsedResponse } from "services/openai/types";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(PositionProfile) private positionsProfilesRepository: Repository<PositionProfile>,
  ) {}

  createProfile(profile: CreateProfileDto): Promise<InsertResult> {
    return this.profileRepository.insert(profile);
  }

  postulateProfile(postulation: PostulateProfileDto): Promise<InsertResult> {
    return this.positionsProfilesRepository.insert(postulation);
  }

  getProfilesByPosition(position: DeepPartial<Position>): Promise<Profile[]> {
    return this.profileRepository.find({ relations: ["position"], where: { position: { positions: position } } });
  }

  async ponderateScoringAndPostulate(
    averageImplementedResponse: ParsedResponse[],
    positions: DeepPartial<Position>,
    profiles: DeepPartial<Profile>,
  ): Promise<InsertResult> {
    const average = averageImplementedResponse.reduce((prevValue, response) => prevValue + response.value, 0) / averageImplementedResponse.length;
    return await this.postulateProfile({ positions, profiles, scoring: average });
  }

  existsPostulation(email: DeepPartial<Profile>, position: DeepPartial<Position>): Promise<boolean> {
    const result = this.positionsProfilesRepository.exist({ where: { profiles: email, positions: position } });
    return result;
  }

  async getHigherProfiles(min: number) {
    const postulations = (await this.positionsProfilesRepository.find()) as PositionProfile[];
    const profiles = (await this.profileRepository.find({ relations: ["position"] })) as Profile[];
    const filteredProfiles = postulations.filter((postulation) => postulation.scoring > min).map((postulation) => postulation.profiles);
    const result = profiles.filter((profile) => filteredProfiles.includes(profile.email as unknown as Profile));
    return result;
  }
}
