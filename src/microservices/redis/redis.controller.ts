import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private redisService: RedisService) {}

  @MessagePattern('GET')
  get(@Payload() key: string) {
    return this.redisService.get(key);
  }

  @MessagePattern('SET')
  set(@Payload() { key, value, expiresIn }) {
    return this.redisService.set(key, value, expiresIn);
  }
}
