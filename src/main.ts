import { NestFactory } from "@nestjs/core";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { JfdsModule } from "./jfds.module";
import { config } from "dotenv";

config();

function setupSwagger<T>(app: INestApplication<T>) {
  const openapiConfig = new DocumentBuilder()
    .setTitle("Jfds Api")
    .setDescription("Jfds")
    .setVersion("0.0.1")
    .addServer("http://localhost:3000")
    .addTag("Health")
    .addTag("Users")
    .addTag("Security")
    .addTag("Resources")
    .addTag("Moneys")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, openapiConfig);
  SwaggerModule.setup("docs", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(JfdsModule, {
    logger: ["error", "warn", "log", "verbose", "fatal"],
  });
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(+(process.env.PORT || 3000));
}

bootstrap();
