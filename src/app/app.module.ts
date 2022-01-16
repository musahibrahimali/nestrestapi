import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import * as Joi from 'joi';
import configuration from '../config/configuration';
import { RolesGuard } from '../authorization/authorizations';

@Module({
  imports: [
    // configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      expandVariables: true,
      // validate stuff with Joi
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000),
      }),
      validationOptions: {
        // allow unknown keys (change to false to fail on unknown keys)
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    // connect to mongodb database
    MongooseModule.forRoot(
      "mongodb://localhost/nest-rest-api",
      { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    ), 
    // other modules
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}
