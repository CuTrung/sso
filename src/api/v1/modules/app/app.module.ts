import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from '../modules/user/user.module';
import { UserModule } from '@v1/modules/user/user.module';
import { PrismaModule } from '@v1/modules/prisma/prisma.module';
import { UtilModule } from '../util/util.module';
import { AuthModule } from '@v1/modules/auth/auth.module';
import { RedisModule } from '@v1/modules/microservices/redis/redis.module';
import { MicroservicesModule } from '@v1/modules/microservices/microservices.module';
import * as cookieParser from 'cookie-parser';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@v1/modules/auth/auth.guard';
import { TokenModule } from '@v1/modules/util/token/token.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    UtilModule,
    AuthModule,
    RedisModule,
    MicroservicesModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
