import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppMiddleware } from "./app.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  AppMiddleware.use(app)
  await app.listen(3000);
}
bootstrap();
