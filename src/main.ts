import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableVersioning({ type: VersioningType.URI });
    app.enableCors();

    const config = new DocumentBuilder().setTitle("CV One Pager").setDescription("CV One Pager API").setVersion("1.0").addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
