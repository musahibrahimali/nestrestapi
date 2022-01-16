import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

// bootsrap the application
const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { 
    cors: true,
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  // middlewares
  app.use(cookieParser());
  app.use(helmet());
  // global pipes
  app.useGlobalPipes(new ValidationPipe());

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nest.js Rest Api')
    .setDescription('This is a full crud api for a nest js project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // start up server
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port).then(() => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Swagger running on port http://localhost:${port}/api`);
    console.log("Press CTRL-C to stop server");
  }).catch((err) => {
    console.log("There was an error starting server. ", err);
  });
}

// start the application
bootstrap();
