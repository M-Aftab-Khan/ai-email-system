import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QueueModule } from './queue/queue.module';
import { EmailQueueModule } from './email-queue/email-queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import {ExpressAdapter} from '@bull-board/express';

@Module({
  imports: [
    BullBoardModule.forRoot({
      route:'/queues',
      adapter:ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name:'email-queue',
      adapter:BullMQAdapter,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    QueueModule,
    EmailQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
