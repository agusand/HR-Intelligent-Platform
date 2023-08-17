import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import Question from "./question.entity";
import PositionProfile from "./position-profile.entity";

@Entity({ name: "positions" })
export default class Position {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 50, nullable: false })
  name!: string;

  @OneToMany(() => Question, (question) => question.question)
  @JoinColumn()
  questions!: Question[];

  @OneToMany(() => PositionProfile, (profile) => profile.positions)
  @JoinColumn({ name: "profiles" })
  profiles!: PositionProfile[];
}
