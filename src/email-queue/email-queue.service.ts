import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {InjectQueue} from '@nestjs/bullmq';

@Injectable()
export class EmailQueueService {
    constructor(
        @InjectQueue('email-queue') private readonly emailQueue:Queue
    ) {}

    async addEmailJob(data:{
        to:string,
        type?:'welcome',
        name?:string,
        subject?:string,
        body?:string,
        delay?:number
    }) {
        await this.emailQueue.add('send-email', data,{
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            delay: data.delay || 0,
        });
    }
}
