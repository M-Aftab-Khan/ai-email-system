import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

export interface GeneratedEmail {
  subject: string;
  body: string;
}

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateWelcomeEmail(name: string): Promise<GeneratedEmail> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You write warm, concise welcome emails for a new user of "AI Email System". ' +
              'Respond ONLY with a JSON object having exactly two string fields: "subject" and "body". ' +
              'Keep the subject under 60 characters and the body friendly and under 120 words.',
          },
          {
            role: 'user',
            content: `Write a welcome email for a newly registered user named ${name}.`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) {
        throw new Error('OpenAI returned an empty response');
      }

      const parsed = JSON.parse(raw) as Partial<GeneratedEmail>;
      if (!parsed.subject || !parsed.body) {
        throw new Error('OpenAI response missing subject or body');
      }

      return { subject: parsed.subject, body: parsed.body };
    } catch (error) {
      this.logger.error(
        `AI welcome email generation failed, using fallback: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return this.fallbackWelcomeEmail(name);
    }
  }

  private fallbackWelcomeEmail(name: string): GeneratedEmail {
    return {
      subject: 'Welcome to AI Email System',
      body:
        `Hi ${name},\n\n` +
        `Thanks for registering! Your account has been created successfully.\n\n` +
        `We're glad to have you on board.`,
    };
  }
}
