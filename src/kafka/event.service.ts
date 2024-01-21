import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { EmailService } from './email/email.service';

@Injectable()
export class EventService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    // Consume Data with Spcific topic
    await this.consumerService.consume(
      {
        topics: ['new-user-registered', 'verification-status'],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            topic: topic.toString(),
            value: message.value.toString(),
            partition: partition,
          });
          //!! For all the topics produced in Java, double
          //!! JSON parsing of `message.value` string is required
          const eventMessage: any = JSON.parse(
            JSON.parse(message.value.toString()),
          );
          switch (topic.toString()) {
            case 'new-user-registered':
              this.emailService.sendVerificationEmailWorkFlowStart(
                eventMessage,
              );
              break;
            case 'verification-status':
              this.emailService.informUserAccountEnabledWorkFlowStart(
                eventMessage,
              );
          }
        },
      },
    );
  }
}
