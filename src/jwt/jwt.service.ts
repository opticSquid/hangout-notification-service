import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload } from '@nestjs/microservices';
import { sign, verify, decode, JwtPayload } from 'jsonwebtoken';
@Injectable()
export class JwtService {
  private readonly log: Logger = new Logger(JwtService.name);
  constructor(private readonly config: ConfigService) {}

  signJwt(user: string): string {
    return sign({ email: user }, this.config.get('JWT_PRIVATE_KEY'), {
      algorithm: 'HS256',
      expiresIn: '10m',
    });
  }
  verifyJwt(token: string): boolean {
    const payLoad: JwtPayload | string = verify(
      token,
      this.config.get('JWT_PRIVATE_KEY'),
    );
    this.log.verbose(`result of jwt verification: ${JSON.stringify(payLoad)}`);
    return payLoad == null ? false : true;
  }
  decryptJwt(token: string): JwtPayload | undefined {
    const payLoad: JwtPayload | null | string = decode(token);
    if (typeof payLoad === 'string' || typeof Payload === null) {
      return undefined;
    } else {
      return payLoad;
    }
  }
}
