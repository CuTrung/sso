import { INestApplication } from '@nestjs/common';
import swaggerConfig from './swagger.config';
import appConfig from './app.config';

export default (app: INestApplication) => {
  appConfig(app);
  swaggerConfig(app);
};
