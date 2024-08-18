import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { JwtPayload } from 'jsonwebtoken';
import { EmailService } from './email/email.service';
import { NewUserRegistered } from './entities/NewUserRegistered';
import { SendRegistrationStatus } from './entities/SendRegistrationStatus';
import { VerificationStatus } from './entities/VerificationStatus';
import { JwtService } from './jwt/jwt.service';
@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceEvent: ClientKafka,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  sendEmailVerificationMail(newUser: string): void {
    console.log('email to be verified: ', newUser);
    const jwtToken: Promise<string> = this.jwtService.signJwt(newUser);
    let confirmation_url: string = this.config.get('MAIL_CONFIRMATION_URL');
    jwtToken
      .then((token: string) => {
        confirmation_url = confirmation_url + token;
        console.log('JWT Token: ', token);
      })
      .catch((err) => {
        console.error('Could not generate JWT');
      })
      .finally(() => {
        this.emailService.sendMailForEmailVerification({
          to: newUser,
          subject: 'Welcome to HangOut! Confirm your Email',
          template: './EmailVerificationTemplate',
          context: {
            // filling <%= %> brackets with content
            confirmation_url: confirmation_url,
          },
        });
      });
  }
  checkJWT(jwt: string): boolean {
    return this.jwtService.verifyJwt(jwt);
  }
  checkUserTokenValidity(token: string) {
    console.log('jwt came for validation:', token);
    if (this.checkJWT(token)) {
      const newUser: JwtPayload | string = this.jwtService.decryptJwt(token);
      if (newUser !== '') {
        const emailVerifiedUser: SendRegistrationStatus = {
          email: newUser.sub.toString(),
          verificationStatus: true,
        };
        this.authServiceEvent.emit('new-verified-user', emailVerifiedUser);
      }
    }
  }
  sendAccountActivationMail(verificationStatus: VerificationStatus) {
    if (verificationStatus.status !== 500) {
      this.emailService.sendMailForEmailVerification({
        to: verificationStatus.email,
        subject: 'Account Activation Successful',
        template: './AccountActivationSuccessful',
        context: {
          // filling <%= %> brackets with content
          name: verificationStatus.name,
        },
      });
    }
  }
}
