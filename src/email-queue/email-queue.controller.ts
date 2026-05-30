import { Controller, Post } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';

@Controller('email-queue')
export class EmailQueueController {
    constructor(
  private emailQueue: EmailQueueService,
) {}

@Post('send-test-email')
async sendTestEmail() {
  return await this.emailQueue.addEmailJob({
    to: 'aftabjsdev@gmail.com',
    subject: 'Hello from Queue',
    body: 'This is async email',
    delay: 5000,
  });
}
}
