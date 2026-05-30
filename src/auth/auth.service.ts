import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/user.dto'
import { LoginDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private jwtService:JwtService,
        private emailQueue:EmailQueueService
    ){}
    async registerUser(data:CreateUserDto){

        const existingUser = await this.prisma.user.findUnique({
            where:{
                email:data.email
            }
        })

        if(existingUser){
            throw new BadRequestException('User with this email already exists');
        }
        const {password,...rest} = data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await  this.prisma.user.create({
            data:{
                ...rest,
                password:hashedPassword
            }
        })

        await this.emailQueue.addEmailJob({
            to: user.email,
            subject: 'Welcome to AI Email System 🎉',
            body: `Hi ${user.name},\n\nThanks for registering! Your account has been created successfully.\n\nWe're glad to have you on board.`,
        });

        return {
            messsage:'User registered successfully',
            user:{
                name:user.name,
                email:user.email
            }
        }
    }

    async loginUser(data:LoginDto){
        const {email,password} = data;
        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            throw new UnauthorizedException('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(password,user.password);

        if(!isValidPassword){
            throw new UnauthorizedException('Invalid email or password');
        }

        // create token 

        const token = this.jwtService.sign({sub:user.id,email:user.email});

        return {
            message:'Login successful',
            token
        }

    }
}
