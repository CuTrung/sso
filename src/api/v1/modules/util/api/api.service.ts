import { Injectable } from '@nestjs/common';
import { ServiceResult } from './api.entity';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class ApiUtilService {
  serviceResult<T = null>({
    data,
    message = 'Some thing wrong on server ...',
    status = HttpStatus.OK,
  }: ServiceResult<T> = {}) {
    return { data, message, status };
  }
}
