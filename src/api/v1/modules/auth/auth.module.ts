import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '@v1/modules/user/user.service';
import { TokenService } from '@v1/modules/util/token/token.service';
import { RedisService } from '@v1/modules/microservices/redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, TokenService, RedisService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
