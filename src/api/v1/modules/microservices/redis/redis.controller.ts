import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private redisService: RedisService) {}

  @MessagePattern('GET')
  async get(@Payload() key: string) {
    return await this.redisService.get(key);
  }

  @MessagePattern('SET')
  async set(@Payload() { key, value, expiresIn }) {
    return await this.redisService.set(key, value, expiresIn);
  }
}
