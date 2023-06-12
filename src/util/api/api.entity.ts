export enum ServiceStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ServiceResult<T = any> = {
  status?: ServiceStatus;
  message?: string;
  data?: T;
};

export type ConditionParams<T> = {
  [key in keyof Partial<T>]: any;
} & {
  fields?: Array<keyof T>;
};
