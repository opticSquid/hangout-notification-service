import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

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
          groupId: 'verification-service-group',
          allowAutoTopicCreation: true,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
