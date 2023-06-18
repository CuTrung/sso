import { INestApplication, Injectable } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RedisService } from './redis/redis.service';
import app from '@src/main';

@Injectable()
export class MicroservicesService {
  private app: INestApplication;
  connectService(serviceOptions: MicroserviceOptions) {
    this.app.connectMicroservice<MicroserviceOptions>(serviceOptions);
  }

  constructor(private redisService: RedisService) {
    this.initAllMicroservices();
  }

  async initAllMicroservices() {
    this.app = await app;
    this.connectService(this.redisService.redisOptions);
    await this.app.startAllMicroservices();
  }
}
