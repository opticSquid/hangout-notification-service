import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AccountVerficationStatus } from './entities/AccountVerficationStatus';
import { AccountActivationRequest } from './entities/AccountActivationRequest';
import { TokenVerificationRequest } from './entities/TokenVerificationRequest';

@Controller()
export class AppController {
  private readonly log = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @EventPattern('account-verification')
  handleEmailNotification(@Payload() data: string) {
    this.appService.sendEmailVerificationMail(data);
  }

  @Post('/verify-token')
  handleCheckUserTokenVaidity(
    @Body() req: TokenVerificationRequest,
  ): AccountVerficationStatus {
    return this.appService.checkUserTokenValidity(req.token);
  }

  @EventPattern('account-activation')
  handleAccountActivationHandler(verificationStatus: AccountActivationRequest) {
    this.appService.sendAccountActivationMail(verificationStatus);
  }
}
