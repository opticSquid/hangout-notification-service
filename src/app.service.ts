import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NewUserRegistered } from './entities/NewUserRegistered';
import { SendRegistrationStatus } from './entities/SendRegistrationStatus';
import { VerificationStatus } from './entities/VerificationStatus';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceEvent: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  sendEmailVerificationMail(newUser: NewUserRegistered) {
    console.log('service function log: ', newUser.email);
    const emailVerifiedUser: SendRegistrationStatus = {
      email: newUser.email,
      verificationStatus: true,
    };
    this.authServiceEvent.emit('new-verified-user', emailVerifiedUser);
  }

  sendAccountActivationMail(verificationStatus: VerificationStatus) {
    console.log(verificationStatus);
  }
}
