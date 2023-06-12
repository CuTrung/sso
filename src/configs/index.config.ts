import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const connectSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  console.log(
    `>>> Connect swagger in http://localhost:${process.env.PORT}/api success !`,
  );
};

export { connectSwagger };
