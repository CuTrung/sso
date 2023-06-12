import { Injectable } from '@nestjs/common';
import { SignInUserDTO, SignUpUserDTO } from './authentication.dto';
import { UserService } from 'src/user/user.service';
import { ApiUtilService } from 'src/util/api/api.service';
import { ServiceStatus } from 'src/util/api/api.entity';
import { TokenService } from 'src/util/token/token.service';
import { RedisService } from 'src/microservices/redis/redis.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private apiUtil: ApiUtilService,
    private tokenService: TokenService,
    private redisService: RedisService,
  ) {}

  async signUp({ name, email, password }: SignUpUserDTO) {
    try {
      const { data: user } = await this.userService.checkAccountExist({
        email,
      });
      if (user)
        return this.apiUtil.serviceResult({
          status: ServiceStatus.SUCCESS,
          message: 'Email is existed',
        });

      const { data } = await this.userService.create({
        name,
        email,
        password: this.tokenService.hashString(password),
      });
      return this.apiUtil.serviceResult({
        status: ServiceStatus.SUCCESS,
        message: 'Sign up success',
        data,
      });
    } catch (error) {
      console.log(
        '>>> ~ file: authentication.service.ts:20 ~ AuthenticationService ~ signUp ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }

  async generateToken(payload: any) {
    const { token: accessToken, publicKey: accessKey } =
      await this.tokenService.createJWT({ payload });
    const { token: refreshToken, publicKey: refreshKey } =
      await this.tokenService.createJWT({ payload, expiresIn: '30d' });

    return { accessToken, accessKey, refreshToken, refreshKey };
  }

  async signIn({ name, email, password }: SignInUserDTO) {
    try {
      const { data: user, status } = await this.userService.getUniqueBy({
        [email ? 'email' : 'name']: email ?? name,
      });
      const isCorrectPassword =
        user && this.tokenService.compareHashString(password, user.password);

      if (user === null || !isCorrectPassword)
        return this.apiUtil.serviceResult({
          status: ServiceStatus.SUCCESS,
          message: 'Login failed',
        });

      // generate token
      const { password: removePassword, id: userId, email: emailUser } = user;
      const { accessToken, accessKey, refreshToken, refreshKey } =
        await this.generateToken({ userId, email: emailUser });

      await this.redisService.set(`accessKey:${userId}`, accessKey);
      await this.redisService.set(`refreshKey:${userId}`, refreshKey);

      return this.apiUtil.serviceResult({
        status: ServiceStatus.SUCCESS,
        message: 'Sign in success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.log(
        '>>> ~ file: authentication.service.ts:52 ~ AuthenticationService ~ signIn ~ error: ',
        error,
      );
      return this.apiUtil.serviceResult();
    }
  }

  async signOut() {
    return true;
  }
}
