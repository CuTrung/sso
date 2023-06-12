import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthenticationGuard } from './auth/authentication/authentication.guard';
import { connectSwagger } from './configs/index.config';
import { MicroservicesService } from './microservices/microservices.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
  });
  connectSwagger(app);

  new MicroservicesService().initAllMicroservices(app);
  app.useGlobalGuards(new AuthenticationGuard());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
