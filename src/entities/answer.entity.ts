import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import Profile from "./profile.entity";
import Question from "./question.entity";

@Entity({ name: "answers" })
export default class Answer {
  @PrimaryColumn("int", { nullable: false })
  @ManyToOne(() => Question, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "questionId", referencedColumnName: "id" })
  questionId!: number;

  @Column("varchar", { length: 2000, nullable: false })
  answer!: string;

  @PrimaryColumn("varchar", { length: 50, nullable: false })
  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profile", referencedColumnName: "email" })
  profile!: string;
}
