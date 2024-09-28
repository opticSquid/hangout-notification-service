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
    this.log.debug('Account verification event consumed');
    this.appService.sendEmailVerificationMail(event.email);
  }

  @Post('/verify-token')
  handleCheckUserTokenVaidity(
    @Body() req: TokenVerificationRequest,
  ): AccountVerficationStatus {
    this.log.debug('received request to verify token');
    return this.appService.checkUserTokenValidity(req.token);
  }

  @EventPattern('account-activation')
  handleAccountActivationHandler(
    @Payload() verificationStatus: AccountActivationEvent,
  ) {
    this.log.debug('Account activation event consumed');
    this.appService.sendAccountActivationMail(verificationStatus);
  }
}
