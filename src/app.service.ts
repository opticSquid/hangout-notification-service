import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { JwtPayload } from 'jsonwebtoken';
import { EmailService } from './email/email.service';
import { AccountActivationEvent } from './entities/AccountActivationEvent';
import { AccountVerficationStatus } from './entities/AccountVerficationStatus';
import { JwtService } from './jwt/jwt.service';
@Injectable()
export class AppService {
  private readonly log: Logger = new Logger(AppService.name);
  constructor(
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  sendEmailVerificationMail(email: string): void {
    const jwtToken: string = this.jwtService.signJwt(email);
    let confirmation_url: string = this.config.get('MAIL_CONFIRMATION_URL');
    confirmation_url = confirmation_url + jwtToken;
    this.log.log('sending email');
    this.emailService.sendMailForEmailVerification({
      to: email,
      subject: 'Welcome to HangOut! Confirm your Email',
      template: './EmailVerificationTemplate',
      context: {
        // filling <%= %> brackets with content
        confirmation_url: confirmation_url,
      },
    });
  }
  checkUserTokenValidity(token: string): AccountVerficationStatus {
    this.log.verbose(`incoming jwt for validation: ${token}`);
    this.log.debug('checking if the token is valid');
    if (this.jwtService.verifyJwt(token)) {
      this.log.verbose('the provided token is valid');
      const newUser: JwtPayload | undefined = this.jwtService.decryptJwt(token);
      this.log.verbose(
        `user we got from the token: ${JSON.stringify(newUser)}`,
      );
      if (newUser) {
        const emailVerifiedUser: AccountVerficationStatus = {
          email: newUser.email,
          isVerified: true,
        };
        return emailVerifiedUser;
      } else {
        return { email: undefined, isVerified: false };
      }
    }
  }

  sendAccountActivationMail(verificationStatus: AccountActivationEvent): void {
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
