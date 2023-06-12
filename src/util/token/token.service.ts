import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateKeyPairSync } from 'crypto';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createRSAKeyPair() {
    return generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
  }

  async createJWT({
    payload,
    expiresIn = '1d',
  }: {
    payload: any;
    expiresIn?: string | number;
  }) {
    try {
      const { privateKey, publicKey } = this.createRSAKeyPair();

      return {
        token: await this.jwtService.signAsync(payload, {
          algorithm: 'RS256',
          privateKey,
          expiresIn,
        }),
        publicKey,
      };
    } catch (error) {
      console.log(
        '>>> ~ file: token.service.ts:44 ~ TokenService ~ error: ',
        error,
      );
    }
  }

  async verifyJWT({ token, publicKey }: { token: string; publicKey: string }) {
    try {
      return await this.jwtService.verifyAsync(token, {
        publicKey,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return { expiredAt: error.expiredAt };
      }
      console.log(
        '>>> ~ file: token.service.ts:43 ~ TokenService ~ verifyJWT ~ error: ',
        error,
      );
    }
  }

  hashString(str: string) {
    return hashSync(str, genSaltSync(10));
  }

  compareHashString(str: string, strHash: string) {
    return compareSync(str, strHash);
  }

  getPayloadJWT(token: string) {
    const payloadBase64 = this.decodeBase64(token);
    const start = payloadBase64.indexOf('}') + 1;
    const end =
      payloadBase64.indexOf('}', payloadBase64.indexOf('exp', start)) + 1;
    const { iat, exp, ...payload } = JSON.parse(
      payloadBase64.slice(start, end),
    );
    return payload;
  }

  decodeBase64(strBase64: string) {
    return Buffer.from(strBase64, 'base64').toString('utf-8');
  }
}
