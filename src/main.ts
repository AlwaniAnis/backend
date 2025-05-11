import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
// Load environment variables from .env file

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // Optional: for JWT auth
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
// .then(() => console.log(`Server is running on port ${process.env.PORT ?? 3000}`))
