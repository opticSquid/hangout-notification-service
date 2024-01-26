import { Module } from '@nestjs/common';
import { AppService } from './app.service';
//import { KafkaModule } from './kafka/kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          // this is the consumer group to which we are going to produce event
          consumer: {
            groupId: 'auth-service-group-server',
          },
        },
      },
    ]),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
