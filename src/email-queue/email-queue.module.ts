import { Module } from '@nestjs/common';
import { EmailQueueController } from './email-queue.controller';
import { EmailQueueService } from './email-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailQueueProcessor } from './email-queue.processor';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  imports:[
    BullModule.registerQueue({
       name: 'email-queue',
    }),
    OpenAiModule
  ],
  controllers: [EmailQueueController],
  providers: [EmailQueueService, EmailQueueProcessor],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
