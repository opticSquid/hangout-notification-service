import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { EventService } from './event.service';
import { EmailService } from './email/email.service';

@Module({
  providers: [ProducerService, ConsumerService, EventService, EmailService],
})
export class KafkaModule {}
