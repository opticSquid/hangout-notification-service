import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { SendRegistrationStatus } from './entities/SendRegistrationStatus';
import { VerificationStatus } from './entities/VerificationStatus';
import { VerifyJWT } from './entities/VerifyJWT';

@Controller()
export class AppController {
  private readonly log = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @EventPattern('account-verification')
  handleEmailNotification(@Payload() data: string) {
    this.appService.sendEmailVerificationMail(data);
  }

  @Post('/verify-token')
  handleCheckUserTokenVaidity(@Body() req: VerifyJWT): SendRegistrationStatus {
    return this.appService.checkUserTokenValidity(req.token);
  }
  @EventPattern('account-activation')
  handleAccountActivationHandler(verificationStatus: VerificationStatus) {
    this.appService.sendAccountActivationMail(verificationStatus);
  }
}
