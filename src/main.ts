import observation from './ObservationConfig';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['verbose'] });
  const log: Logger = new Logger('main');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_SERVER],
      },
      // this is this service's group-id
      consumer: {
        groupId: 'hangout-notification-service',
      },
    },
  });
  // starting otel observation
  observation.start();
  log.log('started observation');
  // starting kafka microservice
  await app.startAllMicroservices();
  log.log('started kafka consumer service');
  // start the app with http server
  await app.listen(process.env.port);
  log.log(`starting http server at port ${process.env.port}`);
}
bootstrap();
