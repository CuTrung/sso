import { PartialType, PickType, IntersectionType } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

export class SignUpUserDTO extends PickType(User, [
  'name',
  'email',
  'password',
]) {}
export class SignInUserDTO extends IntersectionType(
  PickType(PartialType(User), ['name', 'email']),
  PickType(User, ['password']),
) {}
