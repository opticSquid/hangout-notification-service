import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SampleMessage } from './SampleMessage.event';
import { NewUserRegistered } from './kafka/entities/NewUserRegistered';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly eventClient: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  emit_sample_event({ msg, status }: SampleMessage) {
    this.eventClient.emit(
      'sample_topic',
      JSON.stringify({ msg: msg, status: status }),
    );
  }
  sendEmailVerificationMail(newUser: NewUserRegistered) {
    console.log('service function log: ', newUser.email);
  }
}
