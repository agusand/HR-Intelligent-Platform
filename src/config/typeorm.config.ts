import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export class DataBaseConnectionManager {
  private dataBase?: string;
  private userName?: string;
  private password?: string;
  private server?: string;
  private port?: number;

  private async getEnvironmentVariables(): Promise<void> {
    const { DATABASE_NAME, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_PORT } = process.env;

    this.dataBase = DATABASE_NAME;
    this.server = DATABASE_HOST;
    this.port = parseInt(DATABASE_PORT, 10);
    this.userName = DATABASE_USERNAME;
    this.password = DATABASE_PASSWORD;
  }

  getAsyncConfig(): TypeOrmModuleAsyncOptions {
    return {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        await this.getEnvironmentVariables();

        return Promise.resolve({
          type: "mysql",
          host: this.server,
          port: this.port,
          username: this.userName,
          database: this.dataBase,
          password: this.password,
          entities: [__dirname + "/../**/*.entity.{js,ts}"],
          migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
          extra: {
            charset: "utf8mb4_unicode_ci",
          },
          synchronize: false,
          logging: true,
        });
      },
      dataSourceFactory: async (): Promise<DataSource> => {
        await this.getEnvironmentVariables();

        return Promise.resolve(
          new DataSource({
            type: "mysql",
            host: this.server,
            port: this.port,
            username: this.userName,
            database: this.dataBase,
            password: this.password,
            entities: [__dirname + "/../**/*.entity.{js,ts}"],
            migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
            extra: {
              charset: "utf8mb4_unicode_ci",
            },
            synchronize: false,
            logging: true,
          }),
        );
      },
    };
  }
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = new DataBaseConnectionManager().getAsyncConfig();
