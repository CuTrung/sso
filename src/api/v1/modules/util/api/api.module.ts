import { Global, Module } from '@nestjs/common';
import { ApiUtilService } from './api.service';

@Module({
  providers: [ApiUtilService],
  exports: [ApiUtilService],
})
export class ApiModule {}
