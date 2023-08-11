import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "questions" })
export default class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 2000, nullable: false })
  question!: string;

  @Column("varchar", { length: 2000, nullable: false })
  cryteria!: string;
}
