import { Logger, Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { VerificationStatus } from './entities/VerificationStatus';
import { VerifyJWT } from './entities/VerifyJWT';

@Controller()
export class AppController {
  private readonly log = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}
  @MessagePattern('notification')
  handleEmailNotification(
    @Payload() data: string,
    @Ctx() context: KafkaContext,
  ) {
    const key: string = context.getMessage().key.toString();
    // context.getMessage().value will give you the event body
    this.log.verbose(`Incoming notification event type: ${key}`);
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
