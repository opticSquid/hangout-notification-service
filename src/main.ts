import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Partitioners } from 'kafkajs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        // this is this service's group-id
        consumer: {
          groupId: 'hangout-notification-service',
        },
        producer: {
          allowAutoTopicCreation: true,
          createPartitioner: Partitioners.DefaultPartitioner,
        },
      },
      logger: ['verbose'],
    },
  );

  await app.listen();
}
bootstrap();
