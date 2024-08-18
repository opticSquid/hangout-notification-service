import { Injectable } from '@nestjs/common';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { NewUserRegistered } from 'src/entities/NewUserRegistered';
@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}

  async signJwt(user: string): Promise<string> {
    return jwt.sign({ email: user }, await this.config.get('JWT_PRIVATE_KEY'), {
      algorithm: 'HS256',
      expiresIn: '10m',
    });
  }
  verifyJwt(token: string): boolean {
    const payLoad: JwtPayload | string = jwt.verify(
      token,
      this.config.get('JWT_PRIVATE_KEY'),
    );
    console.log('jwt result: ', payLoad);
    return payLoad == null ? false : true;
  }
  decryptJwt(token: string): JwtPayload | string {
    const payLoad: JwtPayload | string = jwt.decode(token);
    return payLoad ? payLoad : '';
  }
}
