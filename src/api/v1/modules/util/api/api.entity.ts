import { HttpStatus } from '@nestjs/common';

export type ServiceResult<T = any> = {
  status?: HttpStatus;
  message?: string;
  data?: T;
};

export type ConditionParams<T> = {
  [key in keyof Partial<T>]: any;
} & {
  fields?: Array<keyof T>;
};
