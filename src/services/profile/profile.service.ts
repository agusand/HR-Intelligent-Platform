import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";

import { CreateProfileDto } from "dtos/create-profile.dto";

import Profile from "entities/profile.entity";

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {}

  createProfile(profile: CreateProfileDto): Promise<InsertResult> {
    return this.profileRepository.insert(profile);
  }
}
