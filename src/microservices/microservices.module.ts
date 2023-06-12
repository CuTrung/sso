import { Global, Module } from '@nestjs/common';
import { MicroservicesService } from './microservices.service';
import { RedisService } from './redis/redis.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [MicroservicesService, RedisService],
  exports: [MicroservicesService],
})
export class MicroservicesModule {}
