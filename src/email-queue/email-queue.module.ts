import { Module } from '@nestjs/common';
import { EmailQueueController } from './email-queue.controller';
import { EmailQueueService } from './email-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailQueueProcessor } from './email-queue.processor';

@Module({
  imports:[
    BullModule.registerQueue({
       name: 'email-queue',
    })
  ],
  controllers: [EmailQueueController],
  providers: [EmailQueueService, EmailQueueProcessor],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
