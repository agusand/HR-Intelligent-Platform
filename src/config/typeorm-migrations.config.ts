import { DataSource } from "typeorm";

export default new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  database: "hrintelligent",
  password: "root",
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  synchronize: false,
  logging: true,
});
