import { Test, TestingModule } from '@nestjs/testing';
import { EmailQueueController } from './email-queue.controller';

describe('EmailQueueController', () => {
  let controller: EmailQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailQueueController],
    }).compile();

    controller = module.get<EmailQueueController>(EmailQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
