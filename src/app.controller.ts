import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AccountVerficationStatus } from './entities/AccountVerficationStatus';
import { AccountActivationEvent } from './entities/AccountActivationEvent';
import { TokenVerificationRequest } from './entities/TokenVerificationRequest';

@Controller()
export class AppController {
  private readonly log = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @EventPattern('account-verification')
  handleEmailNotification(@Payload() event: AccountActivationEvent) {
    this.appService.sendEmailVerificationMail(event.email);
  }

  @Post('/verify-token')
  handleCheckUserTokenVaidity(
    @Body() req: TokenVerificationRequest,
  ): AccountVerficationStatus {
    return this.appService.checkUserTokenValidity(req.token);
  }

  @EventPattern('account-activation')
  handleAccountActivationHandler(
    @Payload() verificationStatus: AccountActivationEvent,
  ) {
    this.appService.sendAccountActivationMail(verificationStatus);
  }
}
