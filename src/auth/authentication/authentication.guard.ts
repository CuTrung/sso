import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/util/token/token.service';
import { Request } from 'express';
import { ApiUtilService } from 'src/util/api/api.service';
import { ServiceResult, ServiceStatus } from 'src/util/api/api.entity';
import { RedisService } from 'src/microservices/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private tokenService?: TokenService,
    private redisService?: RedisService,
    private authenticationService?: AuthenticationService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Xem xét cách làm này: Tạo cả access và refresh nhưng chỉ gửi cho client access, còn refresh lưu lại, nếu access expired thì lấy refresh kiểm tra, nếu refresh expired thì bắt người dùng login lại lấy access và refresh mới, nếu refresh hợp lệ thì renew một cặp AT-RT mới, cập nhật lại AT-RT, và trả về access mới cho client
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { accessToken, refreshToken } =
      req.cookies ?? this.extractTokenFromHeader(req);
    if (accessToken === undefined) throw new UnauthorizedException();

    this.tokenService = new TokenService(new JwtService());
    this.redisService = new RedisService();
    this.authenticationService = new AuthenticationService(
      new UserService(new PrismaService(), new ApiUtilService()),
      new ApiUtilService(),
      new TokenService(new JwtService()),
      new RedisService(),
    );

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
    } = await this.authenticationService.generateToken(payload);

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
