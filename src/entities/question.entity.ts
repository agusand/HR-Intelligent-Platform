import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "questions" })
export default class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 2000 })
  question!: string;
}
