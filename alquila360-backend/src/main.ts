import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from './data-source';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true
    })
  );

  app.enableCors({
    origin: 'http://localhost:3000', // frontend Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
