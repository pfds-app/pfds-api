import { NestFactory } from "@nestjs/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PfdsModule } from "./pfds.module";
import { config } from "dotenv";

config();

function setupSwagger<T>(app: INestApplication<T>) {
  const openapiConfig = new DocumentBuilder()
    .setTitle("Pfds Api")
    .setDescription("Pfds")
    .setVersion("0.0.1")
    .addServer("http://localhost:3000")
    .addTag("Health")
    .addTag("Security")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, openapiConfig);
  SwaggerModule.setup("docs", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(PfdsModule, {
    logger: ["error", "warn", "log", "verbose", "fatal"],
  });
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(+(process.env.PORT || 3000));
}

bootstrap();
