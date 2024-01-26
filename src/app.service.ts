import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SampleMessage } from './SampleMessage.event';

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
}
