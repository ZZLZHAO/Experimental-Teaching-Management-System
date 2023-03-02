import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import env from './env';
import helmet = require( 'helmet');
import RateLimit = require('express-rate-limit')
import { Reflector } from '@nestjs/core';
// somewhere in your initialization file

export class AppMiddleware {
  static use(app: INestApplication) {
    app.use(compression());
    if(env.NODE_ENV==='production'){
      /**
       * To protect your applications from brute-force attacks
       */
      app.use(
         RateLimit({
          windowMs:  60 * 1000,
          max: 100,
           message:'Reaching the rate limit.Contact the administrator.达到请求次数上限.请联系管理员.'
        }),
      );
      /**
       * Helmet can help protect your app from some well-known
       * web vulnerabilities by setting HTTP headers appropriately.
       * Generally, Helmet is just a collection of 12 smaller
       * middleware functions that set security-related HTTP headers
       *
       * https://github.com/helmetjs/helmet#how-it-works
       */
      //会禁止graphql playground在浏览器的使用
      // 好像有问题 先不用
      app.use(helmet());
      /**
       * Apply validation for all inputs globally
       */
    }
    app.enableCors();

    //不知道这个和transform:true有什么区别
    // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(
      new ValidationPipe({
        skipMissingProperties: true,
        /**
         * Strip away all none-object existing properties
         */
        whitelist: true,
        /***
         * Transform input objects to their corresponding DTO objects
         */
        transform: true,
        /**
         *It's highly advised to set forbidUnknownValues: true
         *as it will prevent unknown objects from passing validation.
         */
        forbidUnknownValues: true,
      }),
    );
  }
}
