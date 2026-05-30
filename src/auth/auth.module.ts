import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import {PassportModule} from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    EmailQueueModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
