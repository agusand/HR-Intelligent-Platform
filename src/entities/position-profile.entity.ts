import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import Position from "entities/position.entity";

import Profile from "entities/profile.entity";

@Entity({ name: "positions_profiles" })
export default class PositionProfile {
  @PrimaryColumn("varchar", { length: 50, nullable: false })
  @ManyToOne(() => Profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profiles" })
  profiles!: Profile;

  @PrimaryColumn("int", { nullable: false })
  @ManyToOne(() => Position, { onDelete: "CASCADE" })
  @JoinColumn({ name: "positions" })
  positions!: Position;

  @Column("int", { nullable: true, default: null })
  scoring!: number;
}
