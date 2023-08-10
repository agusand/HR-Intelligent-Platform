import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

import Answer from "./answer.entity";

@Entity({ name: "profiles" })
export default class Profile {
  @PrimaryColumn("varchar", { length: 50 })
  email!: string;

  @Column("varchar", { length: 50 })
  first_name!: string;

  @Column("varchar", { length: 50 })
  last_name!: string;

  @OneToMany(() => Answer, (answer) => answer.profile)
  @JoinColumn({ name: "id" })
  answer!: Answer[];
}
