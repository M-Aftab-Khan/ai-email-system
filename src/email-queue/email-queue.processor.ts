import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import * as nodemailer from 'nodemailer';
import { OpenAiService } from 'src/openai/openai.service';


@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
    constructor(private readonly openAiService: OpenAiService) {
        super();
    }

    async process(job: Job) {
        const { to, type, name } = job.data;

        let { subject, body } = job.data;

        if (type === 'welcome') {
            console.log('Generating AI welcome email for:', to);
            const generated = await this.openAiService.generateWelcomeEmail(name);
            subject = generated.subject;
            body = generated.body;
        }

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
