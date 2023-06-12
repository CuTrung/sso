import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { AuthenticationModule } from './auth/authentication/authentication.module';
import { AuthorizationModule } from './auth/authorization/authorization.module';
import { RedisModule } from './microservices/redis/redis.module';
import { MicroservicesModule } from './microservices/microservices.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    UtilModule,
    AuthenticationModule,
    AuthorizationModule,
    RedisModule,
    MicroservicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
