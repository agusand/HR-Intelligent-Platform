import { Injectable } from "@nestjs/common";

import { typeOrmAsyncConfig } from "config/typeorm.config";

@Injectable()
export class MigrationsService {
  async runMigrations() {
    const dataSource = await typeOrmAsyncConfig.dataSourceFactory();
    const conncetion = await dataSource.initialize();
    await conncetion.runMigrations();
  }
}
