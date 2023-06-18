import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '@v1/modules/util/token/token.service';
import { RedisService } from '@v1/modules/microservices/redis/redis.service';
import { AuthService } from './auth.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private redisService: RedisService,
    private authService: AuthService,
  ) {}

  private readonly PATH_NOT_CHECK = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/sign-out',
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Xem xét cách làm này: Tạo cả access và refresh nhưng chỉ gửi cho client access, còn refresh lưu lại, nếu access expired thì lấy refresh kiểm tra, nếu refresh expired thì bắt người dùng login lại lấy access và refresh mới, nếu refresh hợp lệ thì renew một cặp AT-RT mới, cập nhật lại AT-RT, và trả về access mới cho client

    const [req, res, next] =
      context.getArgs<[Request, Response, NextFunction]>();

    return true;

    if (this.PATH_NOT_CHECK.includes(req.path)) return true;

    const { accessToken, refreshToken } =
      req.cookies ?? this.extractTokenFromHeader(req) ?? {};
    if (accessToken === undefined) throw new UnauthorizedException();

    const payload = await this.tokenService.getPayloadJWT(accessToken);
    let decoded = await this.tokenService.verifyJWT({
      token: accessToken,
      publicKey: await this.redisService.get(`accessKey:${payload.userId}`),
    });

    if (decoded === undefined) throw new UnauthorizedException();

    if (decoded.expiredAt === undefined) {
      req['user'] = payload;
      return true;
    }

    // Nếu accessToken expired
    decoded = await this.tokenService.verifyJWT({
      token: refreshToken,
      publicKey: await this.redisService.get(`refreshKey:${payload.userId}`),
    });
    if (decoded === undefined || decoded.expiredAt)
      throw new UnauthorizedException();

    const {
      accessKey: accessKeyNew,
      accessToken: accessTokenNew,
      refreshKey: refreshKeyNew,
      refreshToken: refreshTokenNew,
    } = await this.authService.generateToken(payload);

    res.cookie('accessToken', accessTokenNew);
    res.cookie('refreshToken', refreshTokenNew);

    await this.redisService.set(`accessKey:${payload.userId}`, accessKeyNew);
    await this.redisService.set(`refreshKey:${payload.userId}`, refreshKeyNew);

    req['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
