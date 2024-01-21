import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { KafkaService } from './kafka.service';
import { EmailService } from './email/email.service';

@Module({
  providers: [ProducerService, ConsumerService, KafkaService, EmailService],
})
export class KafkaModule {}
