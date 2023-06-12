import { Injectable } from '@nestjs/common';
import { ServiceResult, ServiceStatus } from './api.entity';

@Injectable()
export class ApiUtilService {
  serviceResult<T = null>(
    { data, message, status }: ServiceResult<T> = {
      message: 'Some thing wrong on server ...',
      status: ServiceStatus.ERROR,
    },
  ) {
    return { data, message, status };
  }
}
