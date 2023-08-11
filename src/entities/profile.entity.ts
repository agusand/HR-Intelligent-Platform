import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

import Answer from "./answer.entity";

@Entity({ name: "profiles" })
export default class Profile {
  @PrimaryColumn("varchar", { length: 50, nullable: false })
  email!: string;

  @Column("varchar", { length: 50, nullable: false })
  first_name!: string;

  @Column("varchar", { length: 50, nullable: false })
  last_name!: string;

  @Column("boolean", { default: true })
  is_external!: boolean;

  @OneToMany(() => Answer, (answer) => answer.profile)
  @JoinColumn()
  answer!: Answer[];
}
