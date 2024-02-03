// email.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailInterface } from 'src/entities/SendEmailInterface';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMailForEmailVerification(emailDetails: SendEmailInterface) {
    await this.mailerService.sendMail({
      to: emailDetails.to,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: emailDetails.subject,
      template: emailDetails.template, // `.ejs` extension is appended automatically
      context: emailDetails.context,
    });
  }
}
