import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { JwtPayload } from 'jsonwebtoken';
import { EmailService } from './email/email.service';
import { SendRegistrationStatus } from './entities/SendRegistrationStatus';
import { VerificationStatus } from './entities/VerificationStatus';
import { JwtService } from './jwt/jwt.service';
@Injectable()
export class AppService {
  private readonly log: Logger = new Logger(AppService.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceEvent: ClientKafka,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  sendEmailVerificationMail(email: string): void {
    this.log.verbose(`email to be verified: ${email}`);
    const jwtToken: Promise<string> = this.jwtService.signJwt(email);
    let confirmation_url: string = this.config.get('MAIL_CONFIRMATION_URL');
    jwtToken
      .then((token: string) => {
        confirmation_url = confirmation_url + token;
        this.log.verbose(`JWT Token: ${token}`);
      })
      .catch((err) => {
        this.log.error('Could not generate JWT');
      })
      .finally(() => {
        this.emailService.sendMailForEmailVerification({
          to: email,
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
  checkUserTokenValidity(token: string): SendRegistrationStatus {
    this.log.verbose(`incoming jwt for validation: ${token}`);
    if (this.checkJWT(token)) {
      const newUser: JwtPayload | string = this.jwtService.decryptJwt(token);
      if (newUser !== '') {
        const emailVerifiedUser: SendRegistrationStatus = {
          email: newUser.sub.toString(),
          verificationStatus: true,
        };
        return emailVerifiedUser;
      } else {
        return { email: undefined, verificationStatus: false };
      }
    }
  }
  sendAccountActivationMail(verificationStatus: VerificationStatus): void {
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
