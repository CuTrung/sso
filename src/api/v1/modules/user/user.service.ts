import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckAccountExistDTO, CreateUserDTO, UpdateUserDTO } from './user.dto';
import { ApiUtilService } from '@v1/modules/util/api/api.service';
import { ConditionParams } from '@v1/modules/util/api/api.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiUtil: ApiUtilService,
  ) {}

  async getAll() {
    try {
      return this.apiUtil.serviceResult({
        message: 'Get all user success',
        data: await this.prisma.user.findMany(),
      });
    } catch (error) {
      console.log(
        '>>> ~ file: user.service.ts:19 ~ UserService ~ findAll ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }

  async getUniqueBy({ fields, ...condition }: ConditionParams<User>) {
    try {
      const key = Object.keys(condition)[0];
      return this.apiUtil.serviceResult({
        message: `Get user by ${key} success`,
        data: await this.prisma.user.findUnique({
          where: { [key]: condition[key] },
        }),
      });
    } catch (error) {
      console.log(
        '>>> ~ file: user.service.ts:40 ~ UserService ~ getBy ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }

  async checkAccountExist(condition: CheckAccountExistDTO) {
    const key = Object.keys(condition)[0];
    return await this.getUniqueBy({ [key]: condition[key] });
  }

  async create(createUserDto: CreateUserDTO) {
    try {
      const { data: user } = await this.checkAccountExist({
        email: createUserDto.email,
      });
      if (user)
        return this.apiUtil.serviceResult({
          message: 'Email is existed',
        });

      return this.apiUtil.serviceResult({
        message: 'Created user success',
        data: await this.prisma.user.create({
          data: createUserDto,
        }),
      });
    } catch (error) {
      console.log(
        '>>> ~ file: user.service.ts:57 ~ UserService ~ create ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDTO) {
    try {
      const { data: user } = await this.checkAccountExist({
        email: updateUserDto.email,
      });
      if (user)
        return this.apiUtil.serviceResult({
          message: 'Email is existed',
        });

      return this.apiUtil.serviceResult({
        message: 'Created user success',
        data: await this.prisma.user.update({
          where: { id },
          data: updateUserDto,
        }),
      });
    } catch (error) {
      console.log(
        '>>> ~ file: user.service.ts:57 ~ UserService ~ create ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }

  async remove(id: number) {
    try {
      const { data: user } = await this.getUniqueBy({ id });
      if (!user)
        return this.apiUtil.serviceResult({
          message: 'Not found user to deleted',
        });

      return this.apiUtil.serviceResult({
        message: 'Delete user success',
        data: await this.prisma.user.delete({
          where: { id },
        }),
      });
    } catch (error) {
      console.log(
        '>>> ~ file: user.service.ts:94 ~ UserService ~ remove ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }
}
