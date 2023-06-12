import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/util/token/token.service';
import { TokenModule } from 'src/util/token/token.module';
import { RedisService } from 'src/microservices/redis/redis.service';

@Module({
  imports: [TokenModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserService, RedisService],
})
export class AuthenticationModule {}
