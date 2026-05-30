import {Processor, WorkerHost} from '@nestjs/bullmq';
import { Job } from 'bullmq';

import * as nodemailer from 'nodemailer';


@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
    async process(job: Job) {
        const { to, subject, body } = job.data;

         console.log('Sending email to:', to);

        // Create a transporter using your email service configuration

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
         });
        
         await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: body,
         });

         console.log('Email sent to successfully:', to);
    }
}