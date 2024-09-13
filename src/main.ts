import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['verbose'] });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      // this is this service's group-id
      consumer: {
        groupId: 'hangout-notification-service',
      },
      // producer: {
      //   allowAutoTopicCreation: false,
      //   createPartitioner: Partitioners.DefaultPartitioner,
      // },
    },
  });
  // start all microservices.. (here kafka)
  await app.startAllMicroservices();
  console.log('starting http server at port 5012');
  // start the app with http server
  await app.listen(5012);
}
bootstrap();
