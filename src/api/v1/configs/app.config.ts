import { INestApplication, VersioningType } from '@nestjs/common';
import { Request } from 'express';

export default (app: INestApplication) => {
  app.setGlobalPrefix('/api');
  app.enableCors({
    credentials: true,
  });

  const API_VERSION_DEFAULT = '2023-06-18';
  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor(request: Request) {
      return ((request.headers['api-version'] as string) ?? API_VERSION_DEFAULT)
        .replaceAll(' ', '')
        .split(',');
    },
  });
};
