import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { NewUserRegistered } from './entities/NewUserRegistered';
import { VerificationStatus } from './entities/VerificationStatus';
import { VerifyJWT } from './entities/VerifyJWT';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @EventPattern('new-user-registered')
  handleNewUserRegistered(data: NewUserRegistered) {
    this.appService.sendEmailVerificationMail(data);
  }
  @EventPattern('verification-status')
  handleAccountActivationHandler(verificationStatus: VerificationStatus) {
    this.appService.sendAccountActivationMail(verificationStatus);
  }
  @EventPattern('check-integrity-token')
  handleCheckUserTokenVaidity(eventBody: VerifyJWT) {
    this.appService.checkUserTokenValidity(eventBody.token);
  }
}
