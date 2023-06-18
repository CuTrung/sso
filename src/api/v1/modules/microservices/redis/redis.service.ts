import { Inject, Injectable } from '@nestjs/common';
// import Redis from 'ioredis';
import {
  Transport,
  RedisOptions,
  ClientProxyFactory,
} from '@nestjs/microservices';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  readonly redisOptions: RedisOptions = {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  };
  private redis: Redis;

  constructor() {
    if (this.redis === undefined) {
      this.redis = new Redis(this.redisOptions.options);
      console.log('>>> Connect redis success !');
    }
  }

  getClient() {
    return ClientProxyFactory.create(this.redisOptions);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async set(key: string, value: string, expiresIn?: number) {
    if (expiresIn) return await this.redis.setex(key, expiresIn, value);
    await this.redis.set(key, value);
  }
}
