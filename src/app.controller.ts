import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { NewUserRegistered } from './entities/NewUserRegistered';
import { VerificationStatus } from './entities/VerificationStatus';
import { VerifyJWT } from './entities/VerifyJWT';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('notification')
  handleEmailNotification(
    @Payload() data: string,
    @Ctx() context: KafkaContext,
  ) {
    const key: string = context.getMessage().key.toString();
    console.log(`Incoming event: ${key} -> ${context.getMessage().value}`);
    switch (key) {
      case 'email': {
        this.appService.sendEmailVerificationMail(data);
        break;
      }
      default: {
        console.error('no handlers for this type of notification');
      }
    }
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
