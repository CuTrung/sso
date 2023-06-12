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
    if (this.redis) return;
    this.redis = new Redis(this.redisOptions.options);
  }

  getClient() {
    return ClientProxyFactory.create(this.redisOptions);
  }

  get(key: string) {
    return this.redis.get(key);
  }

  set(key: string, value: string, expiresIn?: number) {
    if (expiresIn) return this.redis.setex(key, expiresIn, value);
    this.redis.set(key, value);
  }
}
