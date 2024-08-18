import { Injectable } from '@nestjs/common';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { NewUserRegistered } from 'src/entities/NewUserRegistered';
@Injectable()
export class JwtService {
  constructor(private readonly config: ConfigService) {}

  async signJwt(user: string): Promise<string> {
    let token: string = '';
    jwt.sign(
      { message: user },
      this.config.get('JWT_PRIVATE_KEY'),
      {
        algorithm: 'HS256',
      },
      (err: Error, encoded: string | undefined) => {
        if (encoded != undefined) {
          console.log('token: ', encoded);
        } else {
          console.error('error in signing jwt: ', err);
        }
        token = encoded;
      },
    );
    console.log('token: ', token);
    return token;
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
