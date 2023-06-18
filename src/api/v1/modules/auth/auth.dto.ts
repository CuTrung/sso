import { PartialType, PickType, IntersectionType } from '@nestjs/swagger';
import { Authentication } from './auth.entity';
// import { User } from '@v1/modules/user/user.entity';

export class SignUpUserDTO extends PickType(Authentication, [
  'name',
  'email',
  'password',
]) {}
export class SignInUserDTO extends IntersectionType(
  PickType(PartialType(Authentication), ['name', 'email']),
  PickType(Authentication, ['password']),
) {}
