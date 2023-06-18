import { NestFactory } from '@nestjs/core';
import { AppModule } from '@v1/modules/app/app.module';
import indexConfig from '@v1/configs/index.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  indexConfig(app);
  await app.listen(process.env.PORT || 3000);
  return app;
}

export default bootstrap();
