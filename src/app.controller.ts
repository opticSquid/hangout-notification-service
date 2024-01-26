import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { NewUserRegistered } from './kafka/entities/NewUserRegistered';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @EventPattern('new-user-registered')
  handleNewUserRegistered(data: NewUserRegistered) {
    this.appService.sendEmailVerificationMail(data);
  }
}
