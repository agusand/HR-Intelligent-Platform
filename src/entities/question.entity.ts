import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Position from "./position.entity";

@Entity({ name: "questions" })
export default class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 2000, nullable: false })
  question!: string;

  @Column("varchar", { length: 2000, nullable: false })
  cryteria!: string;

  @ManyToOne(() => Position, { onDelete: "CASCADE" })
  @JoinColumn({ name: "position", referencedColumnName: "id" })
  @Column("int")
  position!: number;
}
