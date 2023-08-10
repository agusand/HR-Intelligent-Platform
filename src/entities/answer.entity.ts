import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import Profile from "./profile.entity";
import Question from "./question.entity";

@Entity({ name: "answers" })
export default class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  @ManyToOne(() => Question)
  @JoinColumn({ name: "id" })
  questionId!: number;

  @Column("varchar", { length: 2000 })
  answer!: string;

  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profile" })
  profile!: Profile;
}
