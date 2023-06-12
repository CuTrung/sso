import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MicroserviceOptions } from '@nestjs/microservices';
import { RedisService } from './redis/redis.service';

@Injectable()
export class MicroservicesService {
  private app: INestApplication;
  connectService(serviceOptions: MicroserviceOptions) {
    this.app.connectMicroservice<MicroserviceOptions>(serviceOptions);
  }

  async initAllMicroservices(app: INestApplication) {
    this.app = app;
    this.connectService(new RedisService().redisOptions);
    await app.startAllMicroservices();
  }
}
