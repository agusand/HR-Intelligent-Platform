import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import Profile from "./profile.entity";

@Entity({ name: "indicators" })
export default class Indicator {
  @PrimaryColumn("varchar", { length: 2000, nullable: false })
  indicator!: string;

  @PrimaryColumn("varchar", { length: 50, nullable: false })
  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profile", referencedColumnName: "email" })
  profile!: string;

  @Column("int")
  value!: number;
}
