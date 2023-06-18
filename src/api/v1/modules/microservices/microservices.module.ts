import { Module } from '@nestjs/common';
import { MicroservicesService } from './microservices.service';
import { RedisService } from './redis/redis.service';

@Module({
  providers: [MicroservicesService, RedisService],
  exports: [MicroservicesService],
})
export class MicroservicesModule {}
