import { Injectable } from '@nestjs/common';
import { NewUserRegistered } from '../entities/NewUserRegistered';
import { ProducerService } from '../producer.service';
import { SendRegistrationStatus } from '../entities/SendRegistrationStatus';
import { ProducerRecord } from 'kafkajs';
import { verificationStatus } from '../entities/VerificationStatus';

@Injectable()
export class EmailService {
  constructor(private readonly producerService: ProducerService) {}
  async sendVerificationEmailWorkFlowStart(
    newUser: NewUserRegistered,
  ): Promise<void> {
    console.log('new User: ', newUser);
    const result: SendRegistrationStatus = {
      email: newUser.email,
      verificationStatus: true,
    };
    const verificationStatusEvent: ProducerRecord = {
      topic: 'new-verified-user',
      messages: [
        {
          value: JSON.stringify(result),
        },
      ],
    };
    this.producerService.produce(verificationStatusEvent);
  }
  async informUserAccountEnabledWorkFlowStart(
    verificationStatus: verificationStatus,
  ) {
    if (verificationStatus.status === 200) {
      console.log('account enabled');
    }
  }
}
