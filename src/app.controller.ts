import { Controller, Get, Inject } from '@nestjs/common';
import { RedisService } from './microservices/redis/redis.service';

@Controller()
export class AppController {
  constructor(private redisService: RedisService) {}

  @Get()
  test() {
    return this.redisService.getClient().send('GET', 'name');
  }
}
