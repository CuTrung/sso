import { Global, Module } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { TokenModule } from './token/token.module';

@Global()
@Module({
  imports: [ApiModule, TokenModule],
  exports: [ApiModule],
})
export class UtilModule {}
